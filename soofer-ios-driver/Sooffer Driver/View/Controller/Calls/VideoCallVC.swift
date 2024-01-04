//
//  VideoCallVC.swift
//  Cabpad Rider
//
//  Created by Abservetech on 21/01/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import UIKit
import AVFoundation
import AgoraRtcKit


class VideoCallVC: UIViewController {
    
  
    
   
 
    
    @IBOutlet weak var controlButtonsView: UIView!
    @IBOutlet weak var userimage : UIImageView!
    @IBOutlet weak var endBtn : UIButton!
    @IBOutlet weak var muteBtn : UIButton!
    
    @IBOutlet weak var soundBtn: UIButton!
    @IBOutlet weak var username : UILabel!
    
    
    var agoraKit: AgoraRtcEngineKit!
    // Update with the App ID of your project generated on Agora Console.
    let appID : String = "ba6c4bfd46af4a40b11458e191e0d54b"
    // App Certificate = "b4ccbe5827604089baa9c1a7441debe1"
    
    // Update with the temporary token generated in Agora Console.
    var token = ""
    var channelName : String = "Sooffer"//"Cabpad_Users"
    var riderfcm : String = ""
    var ridername : String = ""
    var riderpic = String()
    var isSpeaker = Bool()
    var isMuted = Bool()
    var joinButton: UIButton!
    // Track if the local user is in a call
    var joined: Bool = false
    var userRole: AgoraClientRole = .broadcaster
    
    
    
    class func initWithStory()->VideoCallVC{
        let vc = UIStoryboard.init(name: "Call", bundle: Bundle.main).instantiateViewController(withIdentifier: "VideoCallVC") as! VideoCallVC
        return vc
    }
    override func viewDidLoad()  {
        super.viewDidLoad()
        print("puruururu:: \(riderfcm)")
        // Do any additional setup after loading the view.
        SoundManager.shared.stopSound()
        initializeAgoraEngine()
        joinAction()
        muteBtn.setImage(UIImage(named: "micunmute"), for: .normal)
        muteBtn.layer.cornerRadius = 25
        soundBtn.layer.cornerRadius = 25
        setupAction()
        self.username.text = self.ridername
       // self.userimage.pin_setImage(from: URL(string: self.riderpic))
        let urlkf = URL(string: self.riderpic)
        self.userimage.kf.setImage(with: urlkf)
        NotificationCenter.default.addObserver(self, selector: #selector(setupprint), name: Notification.Name("EndVideocall"), object: nil)
        // Determine the initial speakerphone state
        let isSpeakerEnabled = agoraKit.isSpeakerphoneEnabled()

        // Update the button's appearance based on the initial state
        if isSpeakerEnabled {
            // Speaker is enabled
            soundBtn.setImage(UIImage(named: "speaker-on"), for: .normal)
        } else {
            // Speaker is disabled
            soundBtn.setImage(UIImage(named: "speaker-off"), for: .normal)
        }
    }
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        leaveChannel()
        DispatchQueue.global(qos: .userInitiated).async {AgoraRtcEngineKit.destroy()}
    }
    
    @objc func setupprint(){
        self.navigationController?.popViewController(animated: true)
    }
    
    func initializeAgoraEngine() {
        let config = AgoraRtcEngineConfig()
        // Pass in your App ID here.
        config.appId = appID
        // Use AgoraRtcEngineDelegate for the following delegate parameter.
        agoraKit = AgoraRtcEngineKit.sharedEngine(with: config, delegate: self)
   }
    
    func setupAction(){
//        self.muteBtn.addTap {
//            let muteHide = self.muteBtn.setImage(UIImage(named: "micmute"), for: .normal) == self.muteBtn.setImage(UIImage(named: "micmute"), for: .normal)
//          //  let muteHide = muteBtn.setImage(UIImage(named: "micmute"), for: .normal) == UIImage(named: "micmute")
//            print("muteHideee::\(muteHide)")
//            let currentImage = UIImage(named: muteHide ? "micunmute" : "micmute")
//            if !muteHide{
//                print("audio disable")
//                self.agoraKit?.disableAudio()
//            }else{
//                print("audio enable")
//                self.agoraKit?.enableAudio()
//            }
//            //muteBtn.setImage(currentImage
//            self.muteBtn.setImage(currentImage, for: .normal)
//        }
        self.muteBtn.addTap {
            // Determine if the audio is currently muted based on the current image.
            let isMuted = self.muteBtn.currentImage == UIImage(named: "Mute_icon")
            
            let currentImage = isMuted ? UIImage(named: "micunmute") : UIImage(named: "Mute_icon")
            
            if isMuted {
                print("Audio unmuted")
                self.agoraKit?.enableAudio()
            } else {
                print("Audio muted")
                self.agoraKit?.disableAudio()
            }
            
            // Set the new image for the button.
            self.muteBtn.setImage(currentImage, for: .normal)
        }

        self.endBtn.addTap {
            showToast(msg: "Call Ended...")
            self.firebaseNotiifcation(message: "Your Driver disconnected the call", fcm: self.riderfcm)
            self.navigationController?.popViewController(animated: true)
        }
        self.soundBtn.addTap {
            
                // Determine the current speakerphone state
            let isSpeakerEnabled = self.agoraKit.isSpeakerphoneEnabled()
                
                // Toggle the speakerphone state
            self.agoraKit.setEnableSpeakerphone(!isSpeakerEnabled)
                
                // Update the button's appearance based on the new state
                if isSpeakerEnabled {
                    // Speaker is now disabled
                    print("speaker disabled")
                    self.soundBtn.setImage(UIImage(named: "speaker-off"), for: .normal)
                } else {
                    // Speaker is now enabled
                    print("Speaker is now enabled")
                    self.soundBtn.setImage(UIImage(named: "speaker-on"), for: .normal)
                }
            }

        
    }
   
}
extension VideoCallVC : AgoraRtcEngineDelegate{
    // Callback called when a new host joins the channel
    func rtcEngine(_ engine: AgoraRtcEngineKit, didJoinedOfUid uid: UInt, elapsed: Int) {

    }
    func joinAction() {
        if !joined {
             joinChannel()
        // Check if successfully joined the channel and set button title accordingly
        if joined { /*joinButton.setTitle("Leave", for: .normal)*/ }
       } else {
           leaveChannel()
        // Check if successfully left the channel and set button title accordingly
        if !joined { /*joinButton.setTitle("Join", for: .normal)*/ }
       }
    }
    func joinChannel()  {
        if !self.checkForPermissions() {
                showMessage(title: "Error", text: "Permissions were not granted")
                return
            }
        
            let option = AgoraRtcChannelMediaOptions()
        
            // Set the client role option as broadcaster or audience.
            if self.userRole == .broadcaster {
                option.clientRoleType = .broadcaster
           } else {
              option.clientRoleType = .audience
         }
      
       // For an audio call scenario, set the channel profile as communication.
       option.channelProfile = .communication
        
         // Join the channel with a temp token and channel name
        let result = agoraKit?.joinChannel(
              byToken: token, channelId: "Sooffer", uid: 0, mediaOptions: option,
                joinSuccess: { (channel, uid, elapsed) in }
           )
       
          // Check if joining the channel was successful and set joined Bool accordingly
        if (result == 0) {
             joined = true
          //   showMessage(title: "Success", text: "Successfully joined the channel as \(self.userRole)")
        }
    }
    func leaveChannel(){
        agoraKit?.stopPreview()
        let result = agoraKit?.leaveChannel(nil)
       // Check if leaving the channel was successful and set joined Bool accordingly
         if (result == 0) { joined = false }
    }
    func showMessage(title: String, text: String, delay: Int = 2) -> Void {
        let deadlineTime = DispatchTime.now() + .seconds(delay)
        DispatchQueue.main.asyncAfter(deadline: deadlineTime, execute: {
            let alert = UIAlertController(title: title, message: text, preferredStyle: .alert)
            self.present(alert, animated: true)
            alert.dismiss(animated: true, completion: nil)
        })
    }
    func checkForPermissions() -> Bool {
        var hasPermissions =  false //self.avAuthorization(mediaType: .audio)
        switch AVCaptureDevice.authorizationStatus(for: .audio){
        case .authorized: hasPermissions = true
        default: hasPermissions = requestAudioAccess()
        }
        return hasPermissions
    }
    func requestAudioAccess() -> Bool {
        var hasAudioPermission = false
        let semaphore = DispatchSemaphore(value: 0)
        AVCaptureDevice.requestAccess(for: .audio, completionHandler: { granted in
            hasAudioPermission = granted
            semaphore.signal()
        })
        semaphore.wait()
        return hasAudioPermission
    }
//    func avAuthorization(mediaType: AVMediaType) async  -> Bool {
//        let mediaAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: mediaType)
//        switch mediaAuthorizationStatus {
//        case .denied, .restricted: return false
//        case .authorized: return true
//        case .notDetermined:
//            return  await withCheckedContinuation { continuation in
//                AVCaptureDevice.requestAccess(for: mediaType) { granted in
//                    continuation.resume(returning: granted)
//                }
//            }
//        @unknown default: return false
//        }
//    }

}
   /* override func viewDidLoad() {
        super.viewDidLoad()
        print("")
        initializeAgoraEngine()
        joinChannel()
        muteBtn.setImage(UIImage(named: "micmute"), for: .normal)
        setupAction()
        self.username.text = self.ridername
        self.userimage.pin_setImage(from: URL(string: self.riderpic))
        self.muteBtn.setImage(UIImage(named : "btn_mute"), for: .normal)
    }
    class func initWithStory()->VideoCallVC{
        let vc = UIStoryboard.init(name: "Call", bundle: Bundle.main).instantiateViewController(withIdentifier: "VideoCallVC") as! VideoCallVC
        return vc
    }
    
    func initializeAgoraEngine() {
        // Initializes the Agora engine with your app ID.
        agoraKit = AgoraRtcEngineKit.sharedEngine(withAppId: appID, delegate: nil)
    }
    func setupAction(){
        self.muteBtn.addTap {
           /* self.isMuted = !self.isMuted
            print("muted:::", self.isMuted)
            var results = Int32()
            if self.isMuted {
                self.showMessage(title: "Muted", text: "mute")
                results = self.agoraKit.muteLocalAudioStream(true)
                self.muteBtn.backgroundColor = UIColor.gray
            } else {
                self.showMessage(title: "UNMuted", text: "unmute")
                results = self.agoraKit.muteLocalAudioStream(false)
            }*/
            let muteHide = self.muteBtn.setImage(UIImage(named: "btn_mute"), for: .normal) == self.muteBtn.setImage(UIImage(named: "micmute"), for: .normal)
          //  let muteHide = muteBtn.setImage(UIImage(named: "micmute"), for: .normal) == UIImage(named: "micmute")
            let currentImage = UIImage(named: muteHide ? "micunmute" : "btn_mute")
            if !muteHide{
                print("audio disable")
                self.agoraKit?.disableAudio()
            }else{
                print("audio enable")
                self.agoraKit?.enableAudio()
            }
            //muteBtn.setImage(currentImage
            self.muteBtn.setImage(currentImage, for: .normal)
        }
        self.endBtn.addTap {
            showToast(msg: "Call Ended...")
            print("ridertoken:: \(self.riderfcm)")
            self.firebaseNotiifcation(message: "Your driver disconnected the call", fcm: self.riderfcm)
            self.navigationController?.popViewController(animated: true)
        }
        
        self.soundBtn.addTap {
            self.isSpeaker = self.isSpeaker
            print("speaker:::", self.isSpeaker)
            var result = Int32()
            print("Speaker::::", result)
            if self.isSpeaker {
                self.showMessage(title: "speaker", text: "speak")
                result = self.agoraKit.setDefaultAudioRouteToSpeakerphone(true)
                self.soundBtn.backgroundColor = UIColor.gray
            } else {
                self.showMessage(title: "UnSpeaker", text: "unspeak")
                result = self.agoraKit.setDefaultAudioRouteToSpeakerphone(false)
                self.soundBtn.backgroundColor = UIColor.white
            }
        }
    }
    
    
    func joinChannel() {
        // Allows a user to join a channel.
        agoraKit.joinChannel(byToken: token, channelId: "Sooffer", info:nil, uid:0) {[unowned self] (sid, uid, elapsed) -> Void in
            // Joined channel "demoChannel"
            self.agoraKit.setEnableSpeakerphone(true)
            UIApplication.shared.isIdleTimerDisabled = true
        }
    }
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        leaveChannel()
        DispatchQueue.global(qos: .userInitiated).async {AgoraRtcEngineKit.destroy()}
    }
    
    func showMessage(title: String, text: String, delay: Int = 2) -> Void {
        let deadlineTime = DispatchTime.now() + .seconds(delay)
        DispatchQueue.main.asyncAfter(deadline: deadlineTime, execute: {
            let alert = UIAlertController(title: title, message: text, preferredStyle: .alert)
            self.present(alert, animated: true)
            alert.dismiss(animated: true, completion: nil)
        })
    }
 
 func checkForPermissions() async -> Bool {
        let hasPermissions = await self.avAuthorization(mediaType: .audio)
        return hasPermissions
    }
    
    func avAuthorization(mediaType: AVMediaType) async -> Bool {
        let mediaAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: mediaType)
        switch mediaAuthorizationStatus {
        case .denied, .restricted: return false
        case .authorized: return true
        case .notDetermined:
            return await withCheckedContinuation { continuation in
                AVCaptureDevice.requestAccess(for: mediaType) { granted in
                    continuation.resume(returning: granted)
                }
            }
        @unknown default: return false
        }
    }
    
    func joinChannel() async {
        if await !self.checkForPermissions() {
            showMessage(title: "Error", text: "Permissions were not granted")
            return
        }
        let option = AgoraRtcChannelMediaOptions()
        // Set the client role option as broadcaster or audience.
        if self.userRole == .broadcaster {
            option.clientRoleType = .broadcaster
        } else {
            option.clientRoleType = .audience
        }
        // For an audio call scenario, set the channel profile as communication.
        option.channelProfile = .communication
        // Join the channel with a temp token and channel name
        let result = agoraKit.joinChannel(
            byToken: token, channelId: "sooffer", uid: 0, mediaOptions: option,
            joinSuccess: { (channel, uid, elapsed) in }
        )
        // Check if joining the channel was successful and set joined Bool accordingly
        if (result == 0) {
           
            showMessage(title: "Success", text: "Successfully joined the channel as \(self.userRole)")
        }
    }
    func leaveChannel() {
        let result = agoraKit.leaveChannel(nil)
        // Check if leaving the channel was successful and set joined Bool accordingly
        if result == 0 { }
    }*/
    
   /* @IBAction func didClickHangUpButton(_ sender: UIButton) {
        leaveChannel()
    }
    
   /* func leaveChannel() {
        agoraKit.leaveChannel(nil)
        hideControlButtons()
        
        UIApplication.shared.isIdleTimerDisabled = false
    }
    
    func hideControlButtons() {
        controlButtonsView.isHidden = true
    }*/
    
    @IBAction func didClickMuteButton(_ sender: UIButton) {
        sender.isSelected = !sender.isSelected
        // Stops/Resumes sending the local audio stream.
        agoraKit.muteLocalAudioStream(sender.isSelected)
    }
    
    @IBAction func didClickSwitchSpeakerButton(_ sender: UIButton) {
        sender.isSelected = !sender.isSelected
        // Enables/Disables the audio playback route to the speakerphone.
        //
        // This method sets whether the audio is routed to the speakerphone or earpiece. After calling this method, the SDK returns the onAudioRouteChanged callback to indicate the changes.
        agoraKit.setEnableSpeakerphone(sender.isSelected)
    }
}*/

extension VideoCallVC{
    
    func firebaseNotiifcation(message : String,fcm : String){
        print("fcm id is::\(fcm)")
        guard let url = URL(string: "https://fcm.googleapis.com/fcm/send") else {return}
        var request = URLRequest(url: url)
        let header : String = "key=AAAAGAksKio:APA91bFYOC9P4WlYu1cPpYko-PbohBdj0vFDvtPeiht0msz7uy6PXGM4sjoNchnGPuSVExQCcpzLXcPA_ByluhqLyhRlNR5_FYaH2CUtbzmZ3B7zdovvFtxpEnNYThcUOfPM-ntcy74k"
        //"key=AIzaSyAXhSo8C6LWIWmUHUKlqUeJo2VuhTMmsQE"
        request.setValue(header, forHTTPHeaderField: "Authorization")
        request.httpMethod = "POST"
        print("fcm is:: \(fcm)")
        let params = ["to" : fcm,
                      "notification" : [
                        "title" : "Sooffer",
                        "body" : "\(message)",
                        "sound" : "default",
                        "click_action" : "open_video"
                      ],
                      "data" : [
                        "title" : "Huberswiss",
                        "score" : "5x1",
                        "message" :"\(message)",
                        "click_action" : "open_video"
                      ]
        ] as [String : Any]
        
        print("params is:: \(params)")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        guard let httpbody = try? JSONSerialization.data(withJSONObject: params, options: [])  else { return }
        request.httpBody = httpbody
        
        URLSession.shared.dataTask(with: request) { (data, resule, error) in
            guard let data = data else {return}
            
            do{
                print("valuess:: \(data)")
                let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers)
                print("====>postwithHeader",json)
                
            }catch{
                print("JSONS Error")
            }
            
        }.resume()
    }
}
