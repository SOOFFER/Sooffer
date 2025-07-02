//
//  ConfirmBookingView.swift
//  Express Track
//
//  Created by Abservetech on 04/10/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import UIKit


class ConfirmBookingView : UIView{
    
    var confirmBooking = {
        print("Hello this is new variable")
    }
    
    
    var confirmBookingBtn = UIButton()
    
    var viewContaner = UIView()
    var seprateView = UIView()
    var belowSeprateView = UIView()
    var applycoponImage = UIImageView()
    var applycoponTitle = UILabel()
    var applycopon = UILabel()
    
    var rideFare = UILabel()
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        self.setupView()
        self.setupConstratin()
        self.addAction()
        
    }
    
    func setupView(){
        self.confirmBookingBtn.setTitle(Localize.stringForKey(key: "confrm_book"), for: .normal)
        self.confirmBookingBtn.translatesAutoresizingMaskIntoConstraints = false
        self.confirmBookingBtn.countmroundeCornorBorder(borderwith: 10, Bordercolor: UIColor.AppColors, bgcolor: UIColor.AppColors)
        self.addSubview(confirmBookingBtn)
        
        self.viewContaner.roundeCornorBorder = 10
        self.viewContaner.backgroundColor = UIColor.white
        self.viewContaner.translatesAutoresizingMaskIntoConstraints = false
        self.viewContaner.isElevation = 1
        self.addSubview(viewContaner)
        
        self.seprateView.backgroundColor = .gray
        self.seprateView.translatesAutoresizingMaskIntoConstraints = false
        self.viewContaner.addSubview(self.seprateView)
        
        self.belowSeprateView.backgroundColor = .white
        self.belowSeprateView.translatesAutoresizingMaskIntoConstraints = false
        self.viewContaner.addSubview(self.belowSeprateView)
        
        self.applycoponImage.image = UIImage(named: "1")
        self.applycoponImage.tintColor = UIColor.AppColors
        self.applycoponImage.translatesAutoresizingMaskIntoConstraints = false
        self.belowSeprateView.addSubview(self.applycoponImage)
        
        self.applycoponTitle.font = UIFont.systemFont(ofSize: 15)
        self.applycoponTitle.text = "Apply Coupon"
        self.applycoponTitle.textColor = .AppColors
        self.applycoponTitle.translatesAutoresizingMaskIntoConstraints = false
        self.belowSeprateView.addSubview(self.applycoponTitle)
        
        self.applycopon.font = UIFont.systemFont(ofSize: 15)
        self.applycopon.tintColor = UIColor.AppColors
        self.applycopon.text = "Coupon"
        self.applycopon.translatesAutoresizingMaskIntoConstraints = false
        self.belowSeprateView.addSubview(self.applycopon)
        
//        self.rideFare = self.createLabel(textData: "$ 0", color: .black, font: UIFont.systemFont(ofSize: 15))
//        self.viewContaner.addSubview(self.rideFare)
//        self.createLabelConst(lable: self.rideFare, equalToLeading: self.viewContaner.leadingAnchor, leadingConstatnt: 20, equalToTrail: self.viewContaner.trailingAnchor, trailConstatnt: 20, equalToTop: self.viewContaner.topAnchor, topConstatnt: 10, equalToBottom: self.viewContaner.bottomAnchor, bottomConstatnt: -20)
//        self.rideFare.text = "Helloooooo"
    }
    
    func setupConstratin(){
        let confirmBtnConstrain = [
            self.confirmBookingBtn.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 10),
            self.confirmBookingBtn.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: -50),
            self.confirmBookingBtn.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -10),
            self.confirmBookingBtn.heightAnchor.constraint(equalToConstant: 45)
        ]
        NSLayoutConstraint.activate(confirmBtnConstrain)
        
        
        let viewContanerConstrain = [
            self.viewContaner.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 10),
            self.viewContaner.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: -50),
            self.viewContaner.bottomAnchor.constraint(equalTo: self.confirmBookingBtn.topAnchor, constant: -20),
            self.viewContaner.topAnchor.constraint(equalTo: self.topAnchor,constant: 10)
        ]
        NSLayoutConstraint.activate(viewContanerConstrain)
        
        let seprateViewConstrain = [
            self.seprateView.leadingAnchor.constraint(equalTo: self.viewContaner.leadingAnchor, constant: 2),
            self.seprateView.trailingAnchor.constraint(equalTo: self.viewContaner.trailingAnchor, constant: -2),
            self.seprateView.heightAnchor.constraint(equalToConstant: 1),
            self.seprateView.centerYAnchor.constraint(equalTo: self.viewContaner.centerYAnchor)
        ]
        NSLayoutConstraint.activate(seprateViewConstrain)
        
        let belowSeprateViewConstrain = [
            self.belowSeprateView.leadingAnchor.constraint(equalTo: self.viewContaner.leadingAnchor, constant: 2),
            self.belowSeprateView.trailingAnchor.constraint(equalTo: self.viewContaner.trailingAnchor, constant: -2),
            self.belowSeprateView.topAnchor.constraint(lessThanOrEqualTo: self.seprateView.bottomAnchor, constant: 5),
            self.belowSeprateView.bottomAnchor.constraint(equalTo: self.viewContaner.bottomAnchor, constant: -5)
        ]
        NSLayoutConstraint.activate(belowSeprateViewConstrain)
        
        let ApplyImgConstrain = [
            self.applycoponImage.leadingAnchor.constraint(equalTo: self.belowSeprateView.leadingAnchor, constant: 5),
            self.applycoponImage.heightAnchor.constraint(equalToConstant: 30),
            self.applycoponImage.widthAnchor.constraint(equalToConstant: 30),
            self.applycoponImage.centerYAnchor.constraint(equalTo: self.belowSeprateView.centerYAnchor),
            self.applycoponImage.centerYAnchor.constraint(equalTo: self.belowSeprateView.centerYAnchor)
           
        ]
        NSLayoutConstraint.activate(ApplyImgConstrain)
        
        
        let ApplyTitleConstrain = [
            self.applycoponTitle.leadingAnchor.constraint(equalTo: self.applycoponImage.leadingAnchor, constant: 50),
            self.applycoponTitle.trailingAnchor.constraint(equalTo: self.belowSeprateView.trailingAnchor, constant: -10),
            self.applycoponTitle.topAnchor.constraint(equalTo: self.belowSeprateView.topAnchor, constant: 10)
        ]
        NSLayoutConstraint.activate(ApplyTitleConstrain)
        
        let ApplyConstrain = [
            self.applycopon.leadingAnchor.constraint(equalTo: self.applycoponImage.leadingAnchor, constant: 50),
            self.applycopon.trailingAnchor.constraint(equalTo: self.belowSeprateView.trailingAnchor, constant: -10),
            self.applycopon.topAnchor.constraint(equalTo: self.applycoponTitle.bottomAnchor, constant: 10)
        ]
        NSLayoutConstraint.activate(ApplyConstrain)
    }
    
    func addAction(){
        self.confirmBookingBtn.addAction(for: .tap) {
            self.confirmBooking()
        }
        
        self.belowSeprateView.addAction(for: .tap) {
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
}


extension UIView{
    func createLabel(textData : String , color : UIColor , font : UIFont) -> UILabel{
        let lable = UILabel()
        lable.text = textData
        lable.textColor = color
        lable.font = font
        lable.translatesAutoresizingMaskIntoConstraints = false
        
        return lable
    }
    
    func createLabelConst(lable : UILabel, equalToLeading : NSLayoutXAxisAnchor , leadingConstatnt : CGFloat, equalToTrail : NSLayoutXAxisAnchor , trailConstatnt : CGFloat,equalToTop : NSLayoutYAxisAnchor , topConstatnt : CGFloat,equalToBottom : NSLayoutYAxisAnchor , bottomConstatnt : CGFloat){
        let ApplyConstrain = [
            lable.leadingAnchor.constraint(equalTo: equalToLeading, constant: leadingConstatnt),
            lable.trailingAnchor.constraint(equalTo: equalToTrail, constant: trailConstatnt),
            lable.topAnchor.constraint(equalTo: equalToTop, constant: topConstatnt),
            lable.bottomAnchor.constraint(equalTo: equalToBottom, constant: bottomConstatnt)
        ]
        NSLayoutConstraint.activate(ApplyConstrain)
    }
}
