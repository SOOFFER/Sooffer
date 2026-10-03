package com.soofer.app.View;

import com.soofer.app.Model.LoginModel;

public interface Loginview {
    void LoginVIew(retrofit2.Response<LoginModel> Response);
    void Errorlogview(retrofit2.Response<LoginModel> Response);
    void JsonResponse(String object);
}
