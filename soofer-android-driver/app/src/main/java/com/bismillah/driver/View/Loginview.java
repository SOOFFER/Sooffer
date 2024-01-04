package com.bismillah.driver.View;


import com.bismillah.driver.Model.LoginModel;

public interface Loginview {
    void LoginVIew(retrofit2.Response<LoginModel> Response);
    void Errorlogview(retrofit2.Response<LoginModel> Response);
    void JsonResponse(String object);
}
