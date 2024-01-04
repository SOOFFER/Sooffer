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
import Stripe
import SideMenuSwift
import AudioToolbox


@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var profile = ProfileVM()
    var rootVc : UIViewController?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        IQKeyboardManager.shared.enable = true
        GMSServices.provideAPIKey(Constant.googleAPiKey)
        GMSPlacesClient.provideAPIKey(Constant.googleAPiKey)
         STPPaymentConfiguration.shared().publishableKey = Constant.stripkey
        profile = ProfileVM(dataService: ApiRoot())
        FirebaseApp.configure()
        self.nevigation()
        self.registerForPushNotifications()
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
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

    func nevigation(){
        if UserDefaults.standard.value(forKey: UserDefaultsKey.loginstatus) as? String ?? "" == "LoggedIn"{
            self.profile.getProfile()
            self.profile.successprofile = {
                Constant.profileData = self.profile.profileData ?? ProfileModel()
                let homeVc = HomeVc.initWithStory()
                let nav = UINavigationController(rootViewController: homeVc)
                nav.navigationBar.isHidden = true
                let menuVc = MenuVC.initWithStory()
                self.rootVc = SideMenuController(contentViewController: nav, menuViewController: menuVc)
                self.window?.rootViewController = self.rootVc
            }
        }else{
            let root : UIViewController?
            root = UINavigationController(rootViewController: LauncherVC.initWithStoryBoard())
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
    
     func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {

        print("FirebaseFCM: \(fcmToken)")
        DispatchQueue.main.asyncAfter(deadline: .now()+0.5) {
             Constant.fcm_id = fcmToken ?? ""
            UserDefaults.standard.set(fcmToken, forKey: UserDefaultsKey.fcmtoken)
            self.updateToken()
        }
       
    }
    
    func updateToken(){
        if !(UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? "").isEmpty{
            var token : String =  UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
            FireBaseconnection.instanse.updateToken(token: token)
        }else{
            var token : String =  Constant.fcm_id
            FireBaseconnection.instanse.updateToken(token: token)
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
     //   playsound(userinfo: userInfo as NSDictionary)
         print("useringoallert::\(userInfo["message"])")
         if let NotifyMsg = userInfo["message"] as? String {
             // Use the stringValue as a String
             print("String value: \(NotifyMsg)")
              if NotifyMsg == "Your Driver disconnected the call"{

                  NotificationCenter.default.post(name: Notification.Name("EndVideocall"), object: nil)

              }
         }
         
       playsound(userinfo: userInfo as NSDictionary)
        completionHandler([.alert, .badge, .sound])
        
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        // Print message ID.
        // Print full message.
        print("didReceive Response : ",userInfo)
         var message = userInfo["message"]
         print("notify:::\(message)")
        if userInfo["message"] as! String == "Your Driver inviting you to join call"{
            
             NotificationCenter.default.post(name: .pushnotify, object: nil)
        
        }
        completionHandler()
        
        
    }
//     func playsound(userinfo : NSDictionary){
//         print("alerting::::\(userinfo["message"])")
//
//         if userinfo["message"] as! String == "Your Driver inviting you to join call"{
////             SoundManager.shared.playSound(numberOfLoops: 2)
//         }
//     }
     
     func playsound(userinfo : NSDictionary){
         print("alerting::::\(userinfo["message"])")
         
         if userinfo["message"] as! String == "Your Driver inviting you to join call"{
             //SoundManager.shared.playSound(numberOfLoops: 1)
             SoundManager.shared.playSound()
         }
         
          if userinfo["message"] as! String == "Your Driver disconnected the call"{
              SoundManager.shared.stopSound()
          }
//         if userinfo["message"] as! String == "Your Driver disconnected the video call"{
//
//             NotificationCenter.default.post(name: Notification.Name("endVideoCall"), object: nil)
//
//         }
         
         
     }
     
}

