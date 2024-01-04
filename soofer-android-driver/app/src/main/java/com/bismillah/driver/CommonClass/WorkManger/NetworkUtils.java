package com.bismillah.driver.CommonClass.WorkManger;

import com.bismillah.driver.Apllicationcontroller.Appcontroller;
import static com.bismillah.driver.CommonClass.Utiles.isNetworkAvailable;

public class NetworkUtils {
    public static boolean isConnect() {
        return isNetworkAvailable(Appcontroller.getContexts());
    }
}
