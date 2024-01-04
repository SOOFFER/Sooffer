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
import Kingfisher


class VideoCallVC: UIViewController {

        @IBOutlet weak var redBtn: UIButton!
        
        @IBOutlet weak var speakerBtn: UIButton!
        @IBOutlet weak var greenBtn: UIButton!
        @IBOutlet weak var userImage : UIImageView!
        @IBOutlet weak var userlabel : UILabel!
        
      var agoraKit: AgoraRtcEngineKit!
       // By default, set the current user role to broadcaster to both send and receive streams.
       var userRole: AgoraClientRole = .broadcaster
       
       // Update with the App ID of your project generated on Agora Console.
       let appID = "ba6c4bfd46af4a40b11458e191e0d54b"
       // Update with the temporary token generated in Agora Console.
       var token = ""
       // Update with the channel name you used to generate the token in Agora Console.
       var channelName = "Sooffer"
       var driverfcm = ""
       var driverpic = ""
       var drivername = ""
       var isSpeaker = Bool()
       var isMuted = Bool()
    var joinButton: UIButton!
    
  var joined: Bool = false
    
    
    class func initWithStory()->VideoCallVC{
        let vc = UIStoryboard.init(name: "Call", bundle: Bundle.main).instantiateViewController(withIdentifier: "VideoCallVC") as! VideoCallVC
        return vc
    }
    
  
    
    override func viewDidLoad() {
      super.viewDidLoad()
      // Do any additional setup after loading the view.
      SoundManager.shared.stopSound()
      initializeAgoraEngine()
       joinAction()
      //muteBtn.setImage(UIImage(named: "micmute"), for: .normal)
        NotificationCenter.default.addObserver(self, selector: #selector(setupprint), name: Notification.Name("EndVideocall"), object: nil)
      setupUIAction()
      setupAction()
        greenBtn.setImage(UIImage(named: "micunmute"), for: .normal)
        greenBtn.layer.cornerRadius = 25
      userlabel.text = drivername
     // userImage.pin_setImage(from: URL(string: self.driverpic))
        let urlkf = URL(string: self.driverpic)
        userImage.kf.setImage(with: urlkf)
        
        // Determine the initial speakerphone state
        let isSpeakerEnabled = agoraKit.isSpeakerphoneEnabled()

        // Update the button's appearance based on the initial state
        if isSpeakerEnabled {
            // Speaker is enabled
            speakerBtn.setImage(UIImage(named: "speaker-on"), for: .normal)
        } else {
            // Speaker is disabled
            speakerBtn.setImage(UIImage(named: "speaker-off"), for: .normal)
        }
        NotificationCenter.default.post(name: Notification.Name("NotificationIdentifier"), object: nil)

    }
    
    
    
    @objc func setupprint(){
        self.navigationController?.popViewController(animated: true)
    }
    
      func setupUIAction(){
          
//          redBtn.setImage(UIImage(named: "callANS"), for: .normal)
//          redBtn.layer.cornerRadius = redBtn.frame.height / 2
          //          greenBtn.setImage(UIImage(named: "unmuteIcon"), for: .normal)
//          greenBtn.setImage(UIImage(named: "muteIcon"), for: .selected)
//          greenBtn.tintColor = greenBtn.isSelected ? .black : .white
//          greenBtn.backgroundColor = greenBtn.isSelected ? Color(hex: "#FFFFFF") : Color(hex: "#000000")
//              greenBtn.layer.cornerRadius = greenBtn.frame.height / 2
//          greenBtn.addTarget(self, action: #selector(buttonAct(_:)), for: .touchUpInside)
//          agoraKit?.enableAudio()
//
//          speakerBtn.setImage(UIImage(named: "speakerIcon"), for: .normal)
//          speakerBtn.setImage(UIImage(named: "speakerIcon"), for: .selected)
//          speakerBtn.tintColor = speakerBtn.isSelected ? .black : .white
//          speakerBtn.backgroundColor = speakerBtn.isSelected ? Color(hex: "#FFFFFF") : Color(hex: "#000000")
//          speakerBtn.layer.cornerRadius = speakerBtn.frame.height / 2
//          speakerBtn.addTarget(self, action: #selector(buttonAct(_:)), for: .touchUpInside)
//          agoraKit?.setEnableSpeakerphone(false)
          
          self.greenBtn.addTap {
              // Determine if the audio is currently muted based on the current image.
              let isMuted = self.greenBtn.currentImage == UIImage(named: "Mute_icon")
              
              let currentImage = isMuted ? UIImage(named: "micunmute") : UIImage(named: "Mute_icon")
              
              if isMuted {
                  print("Audio unmuted")
                  self.agoraKit?.enableAudio()
              } else {
                  print("Audio muted")
                  self.agoraKit?.disableAudio()
              }
              
              // Set the new image for the button.
              self.greenBtn.setImage(currentImage, for: .normal)
          }
          
          self.speakerBtn.addTap {
              
                  // Determine the current speakerphone state
              let isSpeakerEnabled = self.agoraKit.isSpeakerphoneEnabled()
                  
                  // Toggle the speakerphone state
              self.agoraKit.setEnableSpeakerphone(!isSpeakerEnabled)
                  
                  // Update the button's appearance based on the new state
                  if isSpeakerEnabled {
                      // Speaker is now disabled
                      print("speaker disabled")
                      self.speakerBtn.setImage(UIImage(named: "speaker-off"), for: .normal)
                  } else {
                      // Speaker is now enabled
                      print("Speaker is now enabled")
                      self.speakerBtn.setImage(UIImage(named: "speaker-on"), for: .normal)
                  }
              }
      }
      @objc func buttonAct(_ sender:UIButton){
          sender.isSelected = !sender.isSelected
          sender.tintColor = sender.isSelected ? .black : .white
          sender.backgroundColor = sender.isSelected ? Color(hex: "#FFFFFF") : Color(hex: "#000000")
          if sender == greenBtn,let agora = agoraKit{
              if sender.isSelected{
                  agora.disableAudio()
              }else{
                  agora.enableAudio()
              }
          }else if sender == speakerBtn,let agora = agoraKit{
              agora.setEnableSpeakerphone(!agora.isSpeakerphoneEnabled())
          }
      }
    override func viewDidDisappear(_ animated: Bool) {
      super.viewDidDisappear(animated)
      leaveChannel()
      DispatchQueue.global(qos: .userInitiated).async {AgoraRtcEngineKit.destroy()}
    }
    func initializeAgoraEngine() {
      let config = AgoraRtcEngineConfig()
      // Pass in your App ID here.
      config.appId = appID
      // Use AgoraRtcEngineDelegate for the following delegate parameter.
      agoraKit = AgoraRtcEngineKit.sharedEngine(with: config, delegate: self)
    }
    func setupAction(){
      self.redBtn.addTap {
          showToast(msg: "Call Ended...")
        self.leaveChannel()
        self.firebaseNotiifcation(message: "Your rider disconnected the call", fcm: self.driverfcm, playSound: false)
               //   AlertManager.instance.showToast(msg: "Call Ended...")
//self.dismiss(animated: true, completion: nil)
          self.navigationController?.popViewController(animated: true)
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
    func joinChannel() {
      if !self.checkForPermissions() {
          showMessage(title: "Error", text: "Permissions were not granted",delay: 5)
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
       //  showMessage(title: "Success", text: "Successfully joined the channel as \(self.userRole)")
      }
    }
    func leaveChannel(){
      /*agoraKit?.stopPreview()*/
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
      var hasPermissions = false //self.avAuthorization(mediaType: .audio)
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
  //  func avAuthorization(mediaType: AVMediaType) async -> Bool {
  //    let mediaAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: mediaType)
  //    switch mediaAuthorizationStatus {
  //    case .denied, .restricted: return false
  //    case .authorized: return true
  //    case .notDetermined:
  //      return await withCheckedContinuation { continuation in
  //        AVCaptureDevice.requestAccess(for: mediaType) { granted in
  //          continuation.resume(returning: granted)
  //        }
  //      }
  //    @unknown default: return false
  //    }
  //  }
  }
   /*    override func viewDidLoad() {
           super.viewDidLoad()
           // The following functions are used when calling Agora APIs
           initializeAgoraEngine()
           
           Task {
               await joinChannel()
           }
           self.userlabel.text = self.drivername
           self.userImage.pin_setImage(from: URL(string: self.driverpic))
           setupAction()
           redBtn.addTarget(self, action: #selector(leaveChannel(sender:)), for: .editingChanged)
           greenBtn.addTarget(self, action: #selector(mutedFunc(sender:)), for: .allEvents)
           speakerBtn.addTarget(self, action: #selector(speaker(sender:)), for: .allEvents)
       }
    class func initWithStory()->VideoCallVC{
        let vc = UIStoryboard.init(name: "Call", bundle: Bundle.main).instantiateViewController(withIdentifier: "VideoCallVC") as! VideoCallVC
        return vc
    }
       
       @objc func leaveChannel(sender: UIButton!) {
           leaveChannel()
           
       }
       
       @objc func mutedFunc(sender: UIButton!) {
           isMuted = !isMuted
           print("muted:::", isMuted)
           var results = Int32()
           if isMuted {
               showMessage(title: "Muted", text: "mute")
               results = agoraEngine.muteLocalAudioStream(true)
               greenBtn.backgroundColor = UIColor.gray
           } else {
               showMessage(title: "UNMuted", text: "unmute")
               results = agoraEngine.muteLocalAudioStream(false)
           }
       }
       
       @objc func speaker(sender: UIButton!) {
           isSpeaker = !isSpeaker
           print("speaker:::", isSpeaker)
           var result = Int32()
           print("Speaker::::", result)
           if isSpeaker {
               showMessage(title: "speaker", text: "speak")
               result = agoraEngine.setDefaultAudioRouteToSpeakerphone(true)
               speakerBtn.backgroundColor = UIColor.gray
           } else {
               showMessage(title: "UnSpeaker", text: "unspeak")
               result = agoraEngine.setDefaultAudioRouteToSpeakerphone(false)
               speakerBtn.backgroundColor = UIColor.white
           }
       }
       
    func setupAction() {
        self.redBtn.addTap {
            showToast(msg: "Call Ended...")
            print("driver token:: \(self.driverfcm)")
            self.firebaseNotiifcation(message: "Your Rider disconnected the call", fcm: self.driverfcm)
            self.navigationController?.popViewController(animated: true)
        }
    }
       func initializeAgoraEngine() {
           let config = AgoraRtcEngineConfig()
           // Pass in your App ID here.
           config.appId = appID
           // Use AgoraRtcEngineDelegate for the following delegate parameter.
           agoraEngine = AgoraRtcEngineKit.sharedEngine(with: config, delegate: self)
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
           let result = agoraEngine.joinChannel(
               byToken: token, channelId: "Sooffer", uid: 0, mediaOptions: option,
               joinSuccess: { (channel, uid, elapsed) in }
           )
           // Check if joining the channel was successful and set joined Bool accordingly
           if (result == 0) {
              
               showMessage(title: "Success", text: "Successfully joined the channel as \(self.userRole)")
           }
       }
       func leaveChannel() {
           let result = agoraEngine.leaveChannel(nil)
           // Check if leaving the channel was successful and set joined Bool accordingly
           if result == 0 { }
       }
   }
   extension VideoCallVC: AgoraRtcEngineDelegate {
       // Callback called when a new host joins the channel
       func rtcEngine(_ engine: AgoraRtcEngineKit, didJoinedOfUid uid: UInt, elapsed: Int) {
       }
   }*/

extension VideoCallVC{
    
    func firebaseNotiifcation(message : String,fcm : String,playSound: Bool = false){
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
                        "sound" : playSound ? "phone_loud.mp3" : "default",
                        "click_action" : "open_video"
                      ],
                      "data" : [
                        "title" : "Huberswiss",
                        "score" : "5x1",
                        "message" :"\(message)",
                        "sound" : "default",
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
