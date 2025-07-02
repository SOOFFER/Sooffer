//
//  TermsConditionView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 11/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import Alamofire
import WebKit


class TermsConditionView : UIView  {
    
    //UI Declaraction
    
    @IBOutlet weak var topBtn: UIButton!
    @IBOutlet weak var rightBtn: UIButton!
    @IBOutlet weak var leftBtn: UIButton!
    @IBOutlet weak var bottomBtn: UIButton!
    
    @IBOutlet weak var termsConditionView: UIView!
    @IBOutlet weak var closeImageView: UIView!
    
    @IBOutlet weak var termsConditionTitle: UILabel!
    @IBOutlet weak var webkit : WKWebView!
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    func initView(view : UIView ){
        self.setView(view: view)
        self.setupAction()
        self.setupView()
        self.setupLang()
    }
    
    func setupAction(){
        self.closeImageView.addAction(for: .tap) {
                self.deInitView()
        }
        self.topBtn.addAction(for: .tap) {
            self.deInitView()
        }
        self.bottomBtn.addAction(for: .tap) {
            self.deInitView()
        }
        self.leftBtn.addAction(for: .tap) {
            self.deInitView()
        }
        self.rightBtn.addAction(for: .tap) {
            self.deInitView()
        }
    }
    
    func setupView(){
        self.termsConditionView.layer.cornerRadius = 10
        self.loadWebView(urlstring:  ServiceApi.tc)
       

    }
    
    func setupLang(){
        self.termsConditionTitle.text = Localize.stringForKey(key: "terms_condition")
        
    }
    
    
    //MARK: setView Property
    func setView(view : UIView) {
        self.frame = view.bounds
        self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
        view.addSubview(self)
        view.bringSubviewToFront(self)
        
        self.transform = CGAffineTransform(translationX: 0, y: 0)//.concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
        UIView.animate(withDuration: 0.5) {
            self.transform = .identity
        }
    }
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
            self.transform = CGAffineTransform(translationX: 0, y: 0)//.concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
        }) { (true) in
            self.removeFromSuperview()
        }
    }
    
    //MARK: Register xib view
    class var getView : TermsConditionView {
        return UINib(nibName: "InterNetErrorView", bundle: nil).instantiate(withOwner: nil, options: nil)[1] as! TermsConditionView
    }
    
  
    
}
extension TermsConditionView : WKNavigationDelegate, WKUIDelegate, UIScrollViewDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if let host = webView.url?.absoluteString {
            
          //  Log.i(host)
        }
    }
    
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let host = navigationAction.request.url?.absoluteString {

                decisionHandler(.allow)
            }else{
                 decisionHandler(.allow)
                
            }
           
        }
    
    func loadWebView(urlstring : String){
        self.webkit.uiDelegate = self
        self.webkit.navigationDelegate = self
//        self.webkit.load(URLRequest(url: URL(string: urlstring)!))
        let url = URL(string: ServiceApi.Base_URL+"tnc")
        webkit.load(URLRequest(url: url!))
    }
    
  
}
