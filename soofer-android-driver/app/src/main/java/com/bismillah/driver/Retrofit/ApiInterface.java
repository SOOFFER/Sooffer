package com.bismillah.driver.Retrofit;


import com.bismillah.driver.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.bismillah.driver.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.bismillah.driver.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;
import com.bismillah.driver.Model.AcceptRequestModel;
import com.bismillah.driver.Model.AddBankModel;
import com.bismillah.driver.Model.AddVehicleDocModel;
import com.bismillah.driver.Model.AddVehicleModel;
import com.bismillah.driver.Model.AttendanceModel;
import com.bismillah.driver.Model.BankDetailsModel;
import com.bismillah.driver.Model.CancelTripModel;
import com.bismillah.driver.Model.CarModel;
import com.bismillah.driver.Model.ChangePasswordModel;
import com.bismillah.driver.Model.CityModel;
import com.bismillah.driver.Model.ConfirmaPaymentModel;
import com.bismillah.driver.Model.CountryModel;
import com.bismillah.driver.Model.CreateOrderModel;
import com.bismillah.driver.Model.DeleteVehicle;
import com.bismillah.driver.Model.DiclineRequest;
import com.bismillah.driver.Model.DocumentModel;
import com.bismillah.driver.Model.DocumentUploadModel;
import com.bismillah.driver.Model.DriverDocumentModel;
import com.bismillah.driver.Model.DriverProfileModel;
import com.bismillah.driver.Model.EarningModel;
import com.bismillah.driver.Model.EarningsModel;
import com.bismillah.driver.Model.EstimationModel;
import com.bismillah.driver.Model.FeedbackModel;
import com.bismillah.driver.Model.ForgetPasswordModel;
import com.bismillah.driver.Model.ImageUploadModel;
import com.bismillah.driver.Model.LanguageCurrencyModel;
import com.bismillah.driver.Model.ListVehicleModel;
import com.bismillah.driver.Model.LoginModel;
import com.bismillah.driver.Model.NotificationModel;
import com.bismillah.driver.Model.OTPModel;
import com.bismillah.driver.Model.OTPVerificationModel;
import com.bismillah.driver.Model.OnlineOflline;
import com.bismillah.driver.Model.PackageModel;
import com.bismillah.driver.Model.PaymentModel;
import com.bismillah.driver.Model.PayoutModel;
import com.bismillah.driver.Model.Polygon.PolygonModel;
import com.bismillah.driver.Model.RatingModel;
import com.bismillah.driver.Model.RegisterModel;
import com.bismillah.driver.Model.RemoveCardModel;
import com.bismillah.driver.Model.RequestTexiHail;
import com.bismillah.driver.Model.ScheduleCancelModel;
import com.bismillah.driver.Model.SendPhoneModel;
import com.bismillah.driver.Model.ServiceModel;
import com.bismillah.driver.Model.StateModel;
import com.bismillah.driver.Model.TripDetailsModel;
import com.bismillah.driver.Model.TripFlowModel;
import com.bismillah.driver.Model.TripHistoryModel;
import com.bismillah.driver.Model.TwoDriverModel;
import com.bismillah.driver.Model.UpdatProfileModel;
import com.bismillah.driver.Model.UpdateLocationModel;
import com.bismillah.driver.Model.UpdateVehicleModel;
import com.bismillah.driver.Model.VehicleStateModel;
import com.bismillah.driver.Model.WalletTransactionModel;
import com.bismillah.driver.Model.scheduleTripListModel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import io.reactivex.rxjava3.core.Flowable;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FieldMap;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.HTTP;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.PartMap;
import retrofit2.http.Path;
import retrofit2.http.Query;
import retrofit2.http.QueryMap;

public interface ApiInterface {

    @GET("commondata")
    Call<List<LanguageCurrencyModel>> getCountryandLanguage();

    @FormUrlEncoded
    @POST("driver")
    Call<RegisterModel> getRegister(@FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("driverlogin")
    Call<LoginModel> getLogin(@FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("riderslogins")
    Call<PaymentModel> submitPayment(@FieldMap HashMap<String, String> data);

    @Multipart
    @POST("driverDocs")
    Call<DriverDocumentModel> DocumentUpload(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part filePart);

    @FormUrlEncoded
    @PUT("driverpwd")
    Call<ChangePasswordModel> ChangePassword(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("driver")
    Call<List<DriverProfileModel>> getProfile(@Header("x-access-token") String Access_token);

    @GET("carmakeandyear")
    Call<CarModel> getCarModel(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @POST("drivertaxi")
    Call<AddVehicleModel> AddVehicle(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("drivertaxi")
    Call<AddVehicleModel> editVehicle(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("drivertaxi/{id}")
    Call<List<ListVehicleModel>> getVehicleList(@Header("x-access-token") String Access_token, @Path("id") String id);

    @HTTP(method = "DELETE", path = "drivertaxi", hasBody = true)
    Call<DeleteVehicle> DeleteVhicle(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);


    @Multipart
    @POST("driverTaxiDocs")
    Call<AddVehicleDocModel> uploadVehicledoc(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> map, @Part MultipartBody.Part filePart);


    @Multipart
    @PUT("driver")
    Call<UpdatProfileModel> updateProfile(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part filePart);

    @FormUrlEncoded
    @PUT("setOnlineStatus")
    Call<OnlineOflline> Onlineoffline(@Header("x-access-token") String Access_token, @Field("status") String status);


    @FormUrlEncoded
    @PUT("DriverLocation")
    Call<UpdateLocationModel> UpdateLocation(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("setCurrentTaxi")
    Call<UpdateVehicleModel> UpdateVehicle(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("declineRequest")
    Call<DiclineRequest> getDiclineRequest(@Header("x-access-token") String Access_token, @Field("requestId") String request_id);

    @FormUrlEncoded
    @PUT("acceptRequest")
    Call<AcceptRequestModel> getAcceptRequest(@Header("x-access-token") String Access_token, @Field("requestId") String request_id);

    @FormUrlEncoded
    @PUT("acceptScheduleRequest")
    Call<AcceptRequestModel> getScheduleAcceptRequest(@Header("x-access-token") String Access_token, @Field("requestId") String requestId, @Field("reqtripDT") String reqtripDT);

    @FormUrlEncoded
    @PUT("cancelTrip")
    Call<CancelTripModel> CancelTrip(@Header("x-access-token") String Access_token, @Field("tripId") String tripId, @Field("reason") String reason);

    @FormUrlEncoded
    @PUT("tripCurrentStatus")
    Call<TripFlowModel> TripFlowStatus(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("driverFeedback")
    Call<FeedbackModel> FeedBack(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("driverTripHistory")
    Call<List<TripHistoryModel>> getTripHistory(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("driverEarningsBtDate")
    Call<List<EarningModel>> getEaringList(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("myRatings")
    Call<List<RatingModel>> getRating(@Header("x-access-token") String Access_token);

    @GET("feedbackLists")
    Call<ResponseBody> getFeedbackList(@Header("x-access-token") String Access_token);

    @POST("myEarnings")
    Call<EarningsModel> getEarings(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("pastTripDetail")
    Call<TripDetailsModel> getTripDetails(@Header("x-access-token") String Access_token, @Field("tripId") String tripId);

    @GET("driverUpcomingScheduleTaxi")
    Call<List<scheduleTripListModel>> getScheduleList(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("driverCancelScheduleTaxi")
    Call<ScheduleCancelModel> getcancelShedule(@Header("x-access-token") String Access_token, @Field("requestId") String requestId);

    @FormUrlEncoded
    @POST("createBankAccount")
    Call<AddBankModel> AddAndUpdateBank(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("driverBankDetails")
    Call<BankDetailsModel> getBankDetails(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @POST("driverForgotPassword")
    Call<ForgetPasswordModel> getSendOPTChangesPaassword(@Header("x-access-token") String Access_token, @Field("email") String email);

    @PATCH("driverForgotPassword")
    Call<OTPVerificationModel> getChangePassword(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);

    @GET("vehicletypelists")
    Flowable<ServiceModel> getServiceType(@Header("x-access-token") String Access_token);

    @GET("logout")
    Call<ResponseBody> getLogout(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @POST("verifyNumberDriver")
    Call<OTPModel> getOpt(@Field("phone") String phone, @Field("email") String email_id, @Field("phcode") String phcode, @Field("otp") String otp, @Field("hashval") String hashval);


    @GET("geocode/json")
    Flowable<GeocoderModel> getAddressFromLocation(@Query("latlng") String latlng, @Query("key") String key);

    @GET("getCityBoundaryPolygon/{City}")
    Flowable<PolygonModel> getCityPolygon(@Path("City") String City);

    @GET("getVehicleServiceAvailablity/{vehicle}")
    Flowable<List<VehicleStateModel>> getVehilceStateList(@Header("x-access-token") String Access_token, @Path("vehicle") String City);

    @PATCH("driverActiveTripType")
    Flowable<ForgetPasswordModel> getUpdateVehicle(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);

    @FormUrlEncoded
    @POST("activeTwoDriver")
    Call<TwoDriverModel> getTwodriver(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("driverWalletReport")
    Flowable<List<WalletTransactionModel>> getWalletTransactionHistory(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);


    @FormUrlEncoded
    @POST("estimationFareForHailTaxi")
    Call<EstimationModel> getEstimateFare(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("/maps/api/place/autocomplete/json")
    Call<PlacesResults> getCityResults(@Query("input") String input, @Query("location") String location, @Query("radius") String radius, @Query("key") String key, @Query("components") String components, @Query("sessiontoken") String sessiontoken);

    @GET("geocode/json")
    Call<ReverseGeocoderModel> getReverserGecoder(@Query("address") String Address, @Query("key") String key);


    @FormUrlEncoded
    @POST("requestHailTaxi")
    Call<RequestTexiHail> getRequestHailTaxi(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("pushNotificationForDriver")
    Flowable<List<NotificationModel>> getNotification(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);


    @GET("getpayPackage/")
    Flowable<PackageModel> getPackageList(@Header("x-access-token") String Access_token/*, @Path("service_Type") String service_Type*/);

    @FormUrlEncoded
    @POST("createOrder")
    Flowable<CreateOrderModel> CreateOrderIDApi(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> map);

    @FormUrlEncoded
    @POST("addDriverPackFromApp")
    Flowable<ConfirmaPaymentModel> getConfirmPaymentApi(@Header("x-access-token") String Access_token, @FieldMap Map<String, String> map);

    @FormUrlEncoded
    @PUT("driverRequestPayoutTransferAmount")
    Flowable<PayoutModel> getDriverPayoutApi(@Header("x-access-token") String Access_token, @FieldMap Map<String, String> map);

    @PATCH("tripRequestReceived")
    Flowable<ResponseBody> tripisReceivedApi(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);

    @GET("getNeededDocuments/driverDocs")
    Flowable<DocumentModel> getDriverDocumentListApi(@Header("x-access-token") String Access_token);

    @GET("getNeededDocuments/driverTaxiDocs/{id}")
    Flowable<DocumentModel> getVehicleDocumentListApi(@Header("x-access-token") String Access_token, @Path("id") String id);

    @Multipart
    @POST("docsDriver")
    Flowable<DocumentUploadModel> getUploadDocumentApi(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part fileFront, @Part MultipartBody.Part fileBack);

    @Multipart
    @POST("driverTaxisdocs")
    Flowable<DocumentUploadModel> getVehicleUploadDocumentApi(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part fileFront, @Part MultipartBody.Part fileBack);

    @POST("deleteDriverCard")
    Call<RemoveCardModel> removeCard(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("addDriverCard")
    Call<ResponseBody> AddCard(@Header("x-access-token") String Access_token, @Field("cardToken") String data,@Field("lastNum") String lastNum);


    @GET("getBankData")
    Call<OTPModel> getStripedata(@Header("x-access-token") String Access_token);

    @GET("countries")
    Flowable<List<CountryModel>> getCountryListApi(@Header("x-access-token") String Access_token);

    @GET("state/{id}")
    Flowable<List<StateModel>> getStateListApi(@Header("x-access-token") String Access_token, @Path("id") String id);

    @GET("city/{id}")
    Flowable<List<CityModel>> getCityListApi(@Header("x-access-token") String Access_token, @Path("id") String id);

    @Multipart
    @POST("safeRide/tripImages")
    Call<ImageUploadModel> TripFlowStatusMultiPartApi(@Header("x-access-token") String token,
                                                      @PartMap HashMap<String, RequestBody> map,
                                                      @Part MultipartBody.Part imageArray,
                                                      @Part MultipartBody.Part imageArray1,
                                                      @Part MultipartBody.Part imageArray2,
                                                      @Part MultipartBody.Part imageArray3);

    @POST("safeRide/suggestionDriver")
    Call<SendPhoneModel> sendPhoneNumber(@Header("x-access-token")String token, @Body HashMap<String, String> phone);

    @Multipart
    @POST("driverAttendance")
    Call<AttendanceModel> callAttendance(@Header("x-access-token")String token, @Part MultipartBody.Part filePart);
}
