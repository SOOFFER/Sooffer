package com.soofer.driver.View;


import com.soofer.driver.Model.LoginModel;

public interface Loginview {
    void LoginVIew(retrofit2.Response<LoginModel> Response);
    void Errorlogview(retrofit2.Response<LoginModel> Response);
    void JsonResponse(String object);
}
