<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ConnectException;
use App\User;
use App\Models\ShareTime;
use App\Models\Image;
use App\Models\UserEvent;
use App\Models\UserAnswer;
use App\Models\UserRanking;
use App\Http\Controllers\ReplicateController;

use App\Services\LineBotApi;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    const HTTP_TIMEOUT = 30;

    public function auth(Request $request)
    {
        // Debug
        Log::info($_SERVER['REQUEST_URI']);
        Log::info('===auth===');

        // Set redirect url for bot_prompt=aggressive.
        $channelId = config('services.line.loginChannelId');
        $liffUrl = config('services.line.liffUrl');
        //$liffUrl .= '?oa=1';
        if ($request->has('image_id')) {
            $imageId = $request->input('image_id');
            $liffUrl .= "&image_id={$imageId}";
             Log::info('===auth image_id '.$imageId); //debug
        }
        $liffUrlEncode = urlencode($liffUrl);
        $url = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id={$channelId}&redirect_uri={$liffUrlEncode}&bot_prompt=aggressive&scope=profile&state=0";

        return view('auth', [
            'redirectUrl' => $url,
        ]);
    }

    public function login(Request $request)
    {
        $lineId = $request->post('line_id');
        Log::info('=== Login Line id '.$lineId); //test
        $name = $request->post('name');
        $avatarUrl = $request->post('avatar_url', '');
        $accessToken = $request->post('access_token');
        if (empty($lineId) || empty($name) || empty($accessToken)) {
            return response()->json(['error' => [
                'message' => 'missing parameter'
            ]], 400);
        }
        // this time do not need check friendship_status_changed
        /*
        // Try to get the status from query string and cookie.
        $friendshipStatusChanged = $request->post('friendship_status_changed');
        if (!$friendshipStatusChanged) {
            $friendshipStatusChanged = (Cookie::get('friendship_status_changed') == 1);
            if ($friendshipStatusChanged == true) {
                Cookie::queue(Cookie::forget('friendship_status_changed'));
            }
        }
        */

        $user = User::where('line_id', $lineId)->first();
        if (!$user) {
            $user = new User();
            Log::info('=== New User line id '.$lineId); //test
            $user->line_id = $lineId;

            // Get the friendship for the first time.
            /*
            $result = $this->getLineOAFriendship($accessToken);
            if ($result === true) {
                $user->friendship = true;
            }
            */
        }

        // this time do not need check new_friend
        /*
        if ($user->is_new_friend == false) {
            // Get the flag from client side.
            if ($friendshipStatusChanged == true) {
                // Double check from server side.
                $result = $this->getLineOAFriendship($accessToken);
                if ($result === true) {
                    $user->is_new_friend = true;
                }
            } else {
                // If user didn't add firend at the first time, try to check if they are changed.
                if ($user->friendship == false) {
                    // Double check from server side.
                    $result = $this->getLineOAFriendship($accessToken);
                    if ($result === true) {
                        $user->is_new_friend = true;
                    }
                }
            }
        }
        */

        // Update basic data.
        $user->name = $name;
        $user->avatar_url = $avatarUrl;
        $user->save();

        // Set user pass auth.
        Auth::login($user);

        // Tag.
        /*
        $imageId = $request->post('image_id');
        if (in_array($imageId, [1, 2, 3, 4])) {
            // Tag user by new/old friend.
            $tagName = $user->is_new_friend ? '渠道_分享New' : '渠道_分享Old';
            CresclabController::tagUserByName($user->line_id, $tagName);

            // Tag user by image ID.
            $tagName = $user->is_new_friend ? "渠道_分享New_Frivole桌布{$imageId}" : "渠道_分享Old_Frivole桌布{$imageId}";
            CresclabController::tagUserByName($user->line_id, $tagName);
        }
        */

        return response()->json(['data' => 'success']);
    }

    private function getLineOAFriendship($accessToken)
    {
        $headers = [
            'Authorization' => "Bearer {$accessToken}",
        ];

        $client = new Client([
            'base_uri' => 'https://api.line.me',
            'timeout'  => self::HTTP_TIMEOUT,
        ]);
        try {
            $response = $client->request('GET', '/friendship/v1/status', [
                'headers' => $headers,
            ]);
            $code = $response->getStatusCode();
            $body = $response->getBody();
            $json = json_decode($body, true);
            return $json['friendFlag'];
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $res = $e->getResponse();
                $code = $res->getStatusCode();
                $body = $res->getBody();
                Log::error("Request [/friendship/v1/status] fail, http_code=[{$code}], reason: {$body}");
            }
            return null;
        } catch (ConnectException $e) {
            Log::error("Request [/friendship/v1/status] fail, http connection error.");
            return null;
        }
    }

    public function trackingEvent(Request $request)
    {
        $authUser = Auth::user();

        $ev = new UserEvent();
        $ev->user_id = $authUser->id;
        $ev->season = $request->input('season');
        $ev->category = $request->input('category');
        $ev->action = $request->input('action');
        $ev->image_id = $request->input('image_id');
        $ev->from = $request->input('from');
        $ev->save();

        return response()->json(['data' => 'Success']);
    }

    public function store(Request $request)
    {
        if ($request->file('selectedFile')) {
            $uploadedFile = $request->file('selectedFile');
            $validator = validator($request->file(), [
                'selectedFile' => 'mimes:jpeg,jpg,png,gif|required',
            ]);
            
            if (!$validator->fails()) {
                $filename = Str::uuid() . '.' . $uploadedFile->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('uploadedFiles/', $uploadedFile, $filename);
                
                $photoUrl = Storage::disk('public')->url('uploadedFiles/'.$filename);
                return $photoUrl;
            }
        }
        return false;
    }
}
