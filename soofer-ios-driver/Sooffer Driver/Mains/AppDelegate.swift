//
//  AppDelegate.swift
//  RebuStar Rider
//
//  Created by Abservetech on 28/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import CoreData
import IQKeyboardManagerSwift
import GoogleMaps
import GooglePlaces
import UserNotifications
import UserNotificationsUI
import FirebaseMessaging
import Firebase
import CoreLocation
import AVFoundation

struct StudModel {
    var name : String = String()
    var mark : String = String()
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate,CLLocationManagerDelegate,AVAudioPlayerDelegate {
    
    var window: UIWindow?
    var locationManager = CLLocationManager()
    var currentLocation =  CLLocation()
    var userBearing = Double()
    var lastUserHeading = Double()
    var lastMapBearing = Double()
    var tripId : String = ""
    var profile = ProfileVM()
    var homevm = HomeVM()
    var songPlayer = AVAudioPlayer()
    var stuModel = [StudModel]()
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        IQKeyboardManager.shared.enable = true
        GMSServices.provideAPIKey(Constant.googleAPiKey)
        GMSPlacesClient.provideAPIKey(Constant.googleAPiKey)
        profile = ProfileVM(dataService: ApiRoot())
        self.homevm = HomeVM(dataService: ApiRoot())
        FirebaseApp.configure()
        //        FireBaseconnection.instanse.cancelReason()
        Messaging.messaging().delegate = self
        self.logout()
        self.nevigation()
        self.registerForPushNotifications()
        self.newSong()
//        designpatten()
        return true
    }
    
    func designpatten() {
        var model = [StudModel(name: "barath", mark: "98"),
                     StudModel(name: "yoga", mark: "98.5"),
                     StudModel(name: "raj", mark: "93")]
        
        var value = model.sorted { $0.mark > $1.mark }
        print("mark:::", value)
    }
    
    func newSong(){
        let sound = Bundle.main.path(forResource: "requesting_tone", ofType: "mp3")
        
        do{
            let session: AVAudioSession = AVAudioSession.sharedInstance()
            
            try session.setCategory(AVAudioSession.Category.playback)
            try session.overrideOutputAudioPort(AVAudioSession.PortOverride.none)
            try session.setActive(true)
            
            guard let fileurl = sound else {return}
            
            songPlayer = try AVAudioPlayer(contentsOf: URL(fileURLWithPath: fileurl))
            
            
            songPlayer.delegate = self
            songPlayer.prepareToPlay()
        }catch{
            print("AudioError",error)
        }
    }
    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
        if self.songPlayer.isPlaying{
            self.songPlayer.stop()
        }
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
        
        if self.songPlayer.isPlaying{
            self.songPlayer.stop()
        }
        
        if UserDefaults.standard.value(forKey: UserDefaultsKey.loginstatus) as? String ?? "" == "LoggedIn"{
            
            self.StartupdateLocation()
        }else{
            self.locationManager.stopUpdatingLocation()
        }
    }
    
    func applicationWillEnterForeground(_ application: UIApplication) {
        print("####EnterForground")
        
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
        let value : String = UserDefaults.standard.value(forKey: UserDefaultsKey.isacceptedView) as? String ?? ""
        print("#####BecomeActive",value)
        
        if value == "true"{
            NotificationCenter.default.post(name: .appEnterInForGorund, object: nil)
            
        }else{
            NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
        }
        
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
        // Saves changes in the application's managed object context before the application terminates.
        self.saveContext()
    }
    
    // MARK: - Core Data stack
    
    lazy var persistentContainer: NSPersistentContainer = {
        /*
         The persistent container for the application. This implementation
         creates and returns a container, having loaded the store for the
         application to it. This property is optional since there are legitimate
         error conditions that could cause the creation of the store to fail.
         */
        let container = NSPersistentContainer(name: "RebuStar_Rider")
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                
                /*
                 Typical reasons for an error here include:
                 * The parent directory does not exist, cannot be created, or disallows writing.
                 * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                 * The device is out of space.
                 * The store could not be migrated to the current model version.
                 Check the error message to determine what the actual problem was.
                 */
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        return container
    }()
    
    // MARK: - Core Data Saving support
    
    func saveContext () {
        let context = persistentContainer.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nserror = error as NSError
                fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
            }
        }
    }
    
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool){
        print("@@@@@here")
        if flag == true{
            let value : String = UserDefaults.standard.value(forKey:UserDefaultsKey.isacceptedView) as? String ?? ""
            
            if value == "true"{
                NotificationCenter.default.post(name: .appEnterInForGorund, object: nil)
            }else{
                NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
            }
        }
    }
    
    func logout(){
        print("fcm is is:: \(Constant.fcm_id)")
        let token : String =  Constant.fcm_id
        FireBaseconnection.instanse.forceLogout(token: token) { (logout) in
            print("logout:; \(logout)")
            if logout{
                let domain = Bundle.main.bundleIdentifier!
                UserDefaults.standard.removePersistentDomain(forName: domain)
                UserDefaults.standard.synchronize()
                
                let navigation = UINavigationController(rootViewController: LoginVC.initWithStory())
                self.window?.rootViewController = navigation
            }
        }
    }
    
    func updateToken(){
//        let token : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? Constant.fcm_id
//            print("fcm tokenn is:: \(token)")
//            FireBaseconnection.instanse.updateToken(token: token)
        if !(UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? "").isEmpty{
            var token : String =  UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
            FireBaseconnection.instanse.updateToken(token: token)
        }else{
            var token : String =  Constant.fcm_id
            FireBaseconnection.instanse.updateToken(token: token)
        }
        
    }
    
    func nevigation(){
        if UserDefaults.standard.value(forKey: UserDefaultsKey.loginstatus) as? String ?? "" == "LoggedIn"{
            self.profile.getProfile()
            self.profile.successprofile = {
                if (self.profile.profileData?.taxis.count ?? 0) > 0{
                    Constant.profileData = self.profile.profileData ?? ProfileModel()
                    let root = HomeVC.initWithStory()
                    let Navi = UINavigationController(rootViewController: root)
                    let Rear =  MenuVC.initWithStory()
                    let MenuRoot = SWRevealViewController(rearViewController: Rear, frontViewController: Navi)
                    self.window?.rootViewController = MenuRoot
                }else{
                    let userDocvc = AddVechileVC.initWithStory()
                    userDocvc.pageFrom = "signup"
                    //
                    let root : UIViewController?
                    root = UINavigationController(rootViewController: userDocvc)
                    self.window?.rootViewController = root
                }
                
                
            }
        }else{
            let root : UIViewController?
            root = UINavigationController(rootViewController:LauncherVC.initWithStoryBoard())
            self.window?.rootViewController = root
        }
    }
    
    
}

extension AppDelegate : UNUserNotificationCenterDelegate,MessagingDelegate{
    
    func registerForPushNotifications() {
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
            granted, error in
            print("Permission_granted: \(granted)") // 3
            guard granted else { return }
            Messaging.messaging().delegate = self
            self.getNotificationSettings()
        }
    }
    
    func getNotificationSettings() {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            print("Notification_settings: \(settings)")
            guard settings.authorizationStatus == .authorized else { return }
            DispatchQueue.main.async {
                UIApplication.shared.registerForRemoteNotifications()
            }
        }
    }
    
    func application(_ application: UIApplication,didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("Device_Token: \(token)")
        UserDefaults.standard.set(token, forKey: UserDefaultsKey.deviceToken)
    }
    
    func application( _ application: UIApplication,  didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed_to_register: \(error)")
    }
    
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String) {
        
        print("FirebaseFCM: \(fcmToken)")
        
        DispatchQueue.main.asyncAfter(deadline: .now()+0.5) {
            UserDefaults.standard.set(fcmToken, forKey: UserDefaultsKey.fcmtoken)
            print("fcm token is:: \(fcmToken)")
            Constant.fcm_id = fcmToken
            self.updateToken()
        }
        
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) {
        print("NotificationReceived",userInfo)
    }
    

    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        print("SHKDKAJSHDKJ\(notification)")
        let userInfo = notification.request.content.userInfo
        print("Usernfo : ",userInfo)
       
        print("useringoallert::\(userInfo["message"])")
        if userInfo["message"] as! String == "Your Rider disconnected the call"{

            NotificationCenter.default.post(name: Notification.Name("EndVideocall"), object: nil)

        }
        
        playsound(userinfo: userInfo as NSDictionary)
        completionHandler([.alert, .badge, .sound])
       
        
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        print("didReceive Response : ",userInfo)
       
        if userInfo["message"] as! String == "Your Rider inviting you to join call"{
            
            NotificationCenter.default.post(name: Notification.Name("audiocall"), object: nil)
        
        }
        completionHandler()
        
    }
}

extension AppDelegate{
    func StartupdateLocation() {
        
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = kCLDistanceFilterNone
        locationManager.requestAlwaysAuthorization()
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.pausesLocationUpdatesAutomatically = false
        locationManager.distanceFilter = 5
        locationManager.startUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Error while requesting new coordinates")
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        var location: CLLocation = locations.last!
        print("BAckroundLocation",location.coordinate)
        location = CLLocation(coordinate: location.coordinate, altitude: location.distance(from: location), horizontalAccuracy: location.horizontalAccuracy, verticalAccuracy: location.verticalAccuracy, course: self.lastUserHeading, speed: location.speed, timestamp: Date())
        currentLocation = location
        print("*****BACK_currentLocation",self.currentLocation)
        locationManager.allowsBackgroundLocationUpdates = true
        
        if let profile : ProfileModel = Constant.profileData as? ProfileModel{
            if profile.online{
                self.homevm.updateLocation( loc: self.currentLocation, status: "1")
                self.updateFBLocation(loc: currentLocation)
            }else{
                self.homevm.updateLocation( loc: self.currentLocation, status: "0")
                self.removeFBLocation()
            }
        }
        
    }
    
    //get the vehicle turning angle
    func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
        lastUserHeading = newHeading.trueHeading as Double
    }
    
    func updateFBLocation(loc : CLLocation){
        if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? "" as? String{
            if !trip_id.isEmpty{
                FireBaseconnection.instanse.updateGeoFire(loc: loc)
            }else{
                if Constant.currentTaxi.isDaily{
                    FireBaseconnection.instanse.updateVehicleLocation(loc: loc)
                }
                if Constant.currentTaxi.isRental{
                    FireBaseconnection.instanse.RentalVehicleLocation(loc: loc)
                }
                if Constant.currentTaxi.isOutstation{
                    FireBaseconnection.instanse.outstationLocation(loc: loc)
                }
            }
        }else{
            FireBaseconnection.instanse.updateVehicleLocation(loc: loc)
        }
        
    }
    
    func removeFBLocation(){
        if Constant.currentTaxi.isDaily{
            FireBaseconnection.instanse.removerGeoFrie()
        }
        if Constant.currentTaxi.isRental{
            FireBaseconnection.instanse.RentalremoverGeoFrie()
        }
        if Constant.currentTaxi.isOutstation{
            FireBaseconnection.instanse.outstationremoverGeoFrie()
        }
        
    }
    
    func playsound(userinfo : NSDictionary){
        print("alerting::::\(userinfo["message"])")
        
        if userinfo["message"] as! String == "Your Rider inviting you to join call"{
            //SoundManager.shared.playSound(numberOfLoops: 1)
            SoundManager.shared.playSound()
        }
        
         if userinfo["message"] as! String == "Your Rider disconnected the call"{
             SoundManager.shared.stopSound()
         }
        
        
        
    }
}

