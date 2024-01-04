//
//  SoundManager.swift
//  Cabpad Rider
//
//  Created by Abservetech on 08/03/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import Foundation
import AVFoundation

extension SoundManager {
    func playSound (numberOfLoops : Int = 0) {
        audioPlayer.numberOfLoops = numberOfLoops
        audioPlayer.play()
    }
    
    func stopSound(){
        audioPlayer.stop()
    }
}

class SoundManager {
    
    static let shared : SoundManager = SoundManager()
    
    var fileName : String = "phone_loud"
    var extentionName : String = "mp3"
    
    var CatSound : NSURL?
    var audioPlayer = AVAudioPlayer()
    
    init () {
        CatSound = NSURL(fileURLWithPath: Bundle.main.path(forResource: fileName, ofType: extentionName)!)
        do {
            if CatSound != nil {
                audioPlayer = try AVAudioPlayer(contentsOf: CatSound! as URL)
                audioPlayer.prepareToPlay()
            }
        } catch {
            print("Problem in getting File")
        }
    }
    
}
