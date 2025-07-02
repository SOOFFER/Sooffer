//
//  CustomPopup.swift
//  Sooffer Rider
//
//  Created by Abservetech on 22/05/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import UIKit
import MessageUI

class CustomPopup: UIView, MFMailComposeViewControllerDelegate {
    
    var vc: UIViewController!
    var view: UIView!
    
    @IBOutlet weak var EmailTXT: UITextField!
    
    @IBOutlet weak var popView: UIView!
    @IBOutlet weak var CancelBTN: UIButton!
    
    @IBOutlet weak var emailError: UILabel!
    @IBOutlet weak var SendBTN: UIButton!
    
    @IBAction func send(_ sender: Any) {
        
        emailError.isHidden = true
        
        guard let email =  EmailTXT.text,EmailTXT.text?.count !=
        0 else{
            emailError.isHidden = false
            emailError.text = "Please enter your Email"
            print("Email TextField is Empty!")
            return
        }
        if isValidEmail(email: email) == false  {
            emailError.isHidden = false
            emailError.text = "Please enter valid email Address"
            print(" InValid Email!")
        }
        
        let toRecipients = ["gowthamstef21@gmail.com"]
        let subject = "My Subject"
        let body = EmailTXT.text! // Your text fields text

       let  mail = MFMailComposeViewController()
        mail.mailComposeDelegate = self
        mail.setToRecipients(toRecipients)
        mail.setSubject(subject)
        mail.setMessageBody(body, isHTML: false)
        

//        present(mail, animated: true, completion: nil)
       
        
    }
    

    override func awakeFromNib() {
        super.awakeFromNib()
        
        self.popView.layer.cornerRadius = self.frame.height / 60
        self.popView.layer.masksToBounds = true
        
        emailError.isHidden = true
    }
    
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        
    }
    
    init(frame: CGRect, inView: UIViewController) {
        super.init(frame: frame)
        xibSetup(frame: CGRect(x: 0, y: 0, width: frame.width, height: frame.height))
        
        vc = inView
    }
    
    
    func xibSetup(frame: CGRect){
        
        self.view = loadNibView()
        view.frame = frame
        addSubview(view)
    }
    
    func loadNibView() -> UIView {
        
        let bundle = Bundle(for: type(of: self))
        let nib = UINib(nibName: "CustomPopup", bundle: bundle)
        let view = nib.instantiate(withOwner: self, options: nil).first as! UIView
        return view
        
    }
    func isValidEmail(email: String) -> Bool {
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        
        let emailPred = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        return emailPred.evaluate(with: email)
    }
    
   
  
}
