//
//  CommonFuns.swift
//  RebuStar Rider
//
//  Created by Abservetech on 05/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import Toaster


func showToast(msg : String) {
    Toast(text: msg, delay: 0.1, duration: Delay.short).show()
}

func showInternetError(view : UIView){
    showToast(msg: "Enternet_issue")
    InternetIssueView.getView.initView(view: view)
}

func decimalDataString(data : String) -> String{
//    return String(format: "\(Constant.priceTag) %.2f", Double(data ?? "0.0") as! CVarArg)
    return "\(Constant.priceTag)" + " " + "\(data) "
}

func convertToDictionary(text: String) -> [String: Any]? {
    if let data = text.data(using: .utf8) {
        do {
            return try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
        } catch {
            print(error.localizedDescription)
        }
    }
    return nil
}
