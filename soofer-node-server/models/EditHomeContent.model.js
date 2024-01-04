import mongoose from 'mongoose';

var EditHomeContentSch = mongoose.Schema({
  header_first_label: String,
  header_second_label: String,
  home_banner_image: String,
  home_second_title: String,
  home_yellow_one: String,
  home_yellow_two: String,
  third_mid_title_one: String,
  third_mid_desc_one: String,
  third_mid_title_two: String,
  third_mid_desc_two: String,
  third_mid_title_three: String,
  third_mid_desc_three: String,
  mobile_app_left_img: String,
  mobile_app_right_title: String,
  mobile_app_right_desc: String,
  taxi_app_bg_img: String,
  taxi_app_right_title: String,
  taxi_app_right_desc: String,
  contactAdd: String,
  contactNo: String,
  contactEmail: String,
  driver_link_Android: String,
  rider_link_Android: String,
  driver_link_Ios: String,
  rider_link_Ios: String,
  mobile_app_moreinfo: String,
  taxi_app_moreinfo: String,
  social_link_facebook: { type: String, default: "#" },
  social_link_twitter: { type: String, default: "#" },
  driver_link_Google: { type: String, default: "#" },
  language: { type: String, default: "en" } //en/es
});

var EditHomeContent = mongoose.model('edithomecontents', EditHomeContentSch);
module.exports = EditHomeContent;   