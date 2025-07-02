//
//  UXString.swift
//  RebuStar Rider
//
//  Created by Abservetech on 09/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation

extension String{
    func isValidEmail() -> Bool {
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        
        let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        return emailTest.evaluate(with: self)
    }
    
    func isValidPhoneNumber() -> Bool {
        let phoneRegex = "^(()|(00))[0-9]{6,14}$"
        let PhoneTest = NSPredicate(format:"SELF MATCHES %@", phoneRegex)
        return PhoneTest.evaluate(with: self)
    }
    func isPasswordHasNumberAndCharacter() -> Bool {
        let passRegEx = "(?=[^a-z]*[a-z])[^0-9]*[0-9].*"
        let passwordTest = NSPredicate(format: "SELF MATCHES %@", passRegEx)
        return passwordTest.evaluate(with: self)
    }
    
    func capitalizingFirstLetter() -> String {
           return prefix(1).capitalized + dropFirst()
       }

       mutating func capitalizeFirstLetter() {
           self = self.capitalizingFirstLetter()
       }
   
}

