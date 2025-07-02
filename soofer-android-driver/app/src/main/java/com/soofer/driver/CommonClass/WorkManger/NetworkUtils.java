package com.soofer.driver.CommonClass.WorkManger;

import com.soofer.driver.Apllicationcontroller.Appcontroller;
import static com.soofer.driver.CommonClass.Utiles.isNetworkAvailable;

public class NetworkUtils {
    public static boolean isConnect() {
        return isNetworkAvailable(Appcontroller.getContexts());
    }
}
