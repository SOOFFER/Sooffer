//
//  MailViewController.swift
//  Sooffer Rider
//
//  Created by Abservetech on 23/05/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import UIKit
import MessageUI

class MailViewController: UIViewController, MFMailComposeViewControllerDelegate {

    
    @IBOutlet weak var MailTF: UITextField!
    
    @IBOutlet weak var Send: UIButton!
    
    @IBAction func Send(_ sender: Any) {
        let toRecipients = ["mail@mail.com"]
        let subject = "My Subject"
        let body = MailTF.text! // Your text fields text

        let mail = MFMailComposeViewController()
        mail.mailComposeDelegate = self
        mail.setToRecipients(toRecipients)
        mail.setSubject(subject)
        mail.setMessageBody(body, isHTML: false)

        present(mail, animated: true, completion: nil)
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
