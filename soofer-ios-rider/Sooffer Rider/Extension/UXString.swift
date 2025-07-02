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

    func isPasswordHasNumberAndCharacterSign(password: String) -> Bool {
        let passWordRegEx = "[a-zA-Z0-9!@#$%^&*]+"
        let passwordTest = NSPredicate(format: "SELF MATCHES %@", passWordRegEx)
        return passwordTest.evaluate(with: password)
    }
    
        var htmlToAttributedString: NSAttributedString? {
            guard let data = data(using: .utf8) else { return NSAttributedString() }
            do {
                return try NSAttributedString(data: data, options: [.documentType: NSAttributedString.DocumentType.html, .characterEncoding:String.Encoding.utf8.rawValue], documentAttributes: nil)
            } catch {
                return NSAttributedString()
            }
        }
        var htmlToString: String {
            return htmlToAttributedString?.string ?? ""
        }
    
   
}

extension Array where Element:Equatable {
    func removeDuplicates() -> [Element] {
        var result = [Element]()
        
        for value in self {
            if result.contains(value) == false {
                result.append(value)
            }
        }
        
        return result
    }
}
