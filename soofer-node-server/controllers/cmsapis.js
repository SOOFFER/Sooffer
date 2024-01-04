import * as HelperFunc from './adminfunctions';
import * as GFunctions from './functions';
import mongoose from 'mongoose';

import EditHomeContent from '../models/EditHomeContent.model';
import Faq from '../models/Faq.model';
import Help from '../models/Help.model';
import Faqcategory from '../models/Faqcategory.model';
import Helpcategory from '../models/Helpcategory.model';
import Pages from '../models/Pages.model';
import OurDrivers from '../models/ourDrivers.model';
import WebContactUs from '../models/webContact.model';
import cityWiseOffice from '../models/citywiseOffice.model';

import { sendEmail } from './mailGateway';
import { addServiceAvailableCity } from './servicecity.controller';
const config = require('../config');

/**
 * Add  Home Content
 */
export const addhomecontent = (req, res) => {
  var updateData = {
    header_first_label: req.body.header_first_label,
    header_second_label: req.body.header_second_label,
    home_banner_image: req.body.home_banner_image,
    banner_txt: req.body.banner_txt,
    home_second_title: req.body.home_second_title,
    home_yellow_one: req.body.home_yellow_one,
    home_yellow_two: req.body.home_yellow_two,
    third_mid_image_one: req.body.third_mid_image_one,
    third_mid_title_one: req.body.third_mid_title_one,
    third_mid_desc_one: req.body.third_mid_desc_one,
    third_mid_image_two: req.body.third_mid_image_two,
    third_mid_title_two: req.body.third_mid_title_two,
    third_mid_desc_two: req.body.third_mid_desc_two,
    third_mid_image_three: req.body.third_mid_image_three,
    third_mid_title_three: req.body.third_mid_title_three,
    third_mid_desc_three: req.body.third_mid_desc_three,
    mobile_app_bg_img: req.body.mobile_app_bg_img,
    mobile_app_left_img: req.body.mobile_app_left_img,
    mobile_app_right_title: req.body.mobile_app_right_title,
    mobile_app_right_desc: req.body.mobile_app_right_desc,
    taxi_app_bg_img: req.body.taxi_app_bg_img,
    taxi_app_right_title: req.body.taxi_app_right_title,
    taxi_app_right_desc: req.body.taxi_app_right_desc,
    driver_sec_first_label: req.body.driver_sec_first_label,
    driver_sec_second_label: req.body.driver_sec_second_label,
    language: req.body.language ? req.body.language : "en"
  }
  const newDoc = new EditHomeContent(updateData);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("MESSAGE_SENDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Update home first block
 */
export const updatehomeFirstBlock = (req, res) => {
  var language = req.query.language ? req.query.language : "en";
  EditHomeContent.findOne({ language: language }, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var updateData = docs;
    updateData.header_first_label = req.body.header_first_label;
    updateData.header_second_label = req.body.header_second_label;
    if (req['file'] != undefined) {
      updateData.home_banner_image = req['file'].path;
    }
    updateData.home_second_title = req.body.home_second_title;
    updateData.home_yellow_one = req.body.home_yellow_one;
    updateData.home_yellow_two = req.body.home_yellow_two;
    updateData.third_mid_title_one = req.body.third_mid_title_one;
    updateData.third_mid_desc_one = req.body.third_mid_desc_one;
    updateData.third_mid_title_two = req.body.third_mid_title_two;
    updateData.third_mid_desc_two = req.body.third_mid_desc_two;
    updateData.third_mid_title_three = req.body.third_mid_title_three;
    updateData.third_mid_desc_three = req.body.third_mid_desc_three;
    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs.EditHomeContent });
    });
  })
}


/**
 * Update home Second block
 */
export const updatehomeSecondBlock = (req, res) => {
  //var filename = "";
  var language = req.query.language ? req.query.language : "en";
  EditHomeContent.findOne({ language: language }, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var updateData = docs;
    updateData.mobile_app_moreinfo = req.body.mobile_app_moreinfo;
    updateData.mobile_app_right_title = req.body.mobile_app_right_title;
    updateData.mobile_app_right_desc = req.body.mobile_app_right_desc;
    if (req['file'] != undefined) {
      updateData.mobile_app_left_img = req['file'].path;
    }
    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs.EditHomeContent });
    });
  })
}

/**
 * Update home third block
 */
export const updatehomeThirdBlock = (req, res) => {
  //var filename = "";
  var language = req.query.language ? req.query.language : "en";
  EditHomeContent.findOne({ language: language }, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var updateData = docs;
    updateData.taxi_app_moreinfo = req.body.taxi_app_moreinfo;
    updateData.taxi_app_right_title = req.body.taxi_app_right_title;
    updateData.taxi_app_right_desc = req.body.taxi_app_right_desc;
    if (req['file'] != undefined) {
      updateData.taxi_app_bg_img = req['file'].path;
    }
    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs.EditHomeContent });
    });
  })
}


/**
 * Get Home Content
 */
export const gethomecontent = (req, res) => {
  var language = req.query.language ? req.query.language : "en";
  EditHomeContent.find({ language: language }, { _id: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
}


/**
 * Get FAQ 
 */
export const getfaq = (req, res) => {
  var language = req.query.language ? req.query.language : "en";
  Faq.find({ language: language }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

/**
 * Add FAQ 
 */
export const addfaq = (req, res) => {
  var updateData = {
    ifaqcategoryId: req.body.ifaqcategoryId,
    ifaqcategorytitle: req.body.ifaqcategorytitle,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    English: req.body.English,
    language: req.body.language
  }
  const newDoc = new Faq(updateData);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("FAQ_ADDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Update FAQ 
 */
export const updatefaq = (req, res) => {
  var upd = {
    ifaqcategoryId: req.body.ifaqcategoryId,
    ifaqcategorytitle: req.body.ifaqcategorytitle,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    English: req.body.English
  };
  var id = req.params.id;
  var upds = { '_id': id };
  Faq.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });

  });
}

/**
 * Delete FAQ 
 */
export const deletefaq = (req, res) => {
  Faq.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("FAQ_DELETED_SUCCESSFULLY"), 'data': docs });
  });
}


/**
 * Add Help 
 */
export const addhelp = (req, res) => {
  var updateData = {
    ihelpcategoryId: req.body.ihelpcategoryId,
    ihelpcategorytitle: req.body.ihelpcategorytitle,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    English: req.body.English,
    language: req.body.language
  }
  const newDoc = new Help(updateData);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("HELP_ADDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Get Help 
 */
export const gethelp = (req, res) => {
  var language = req.query.language ? req.query.language : "en";
  Help.find({ language: language }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}


/**
 * Update Help 
 */
export const updatehelp = (req, res) => {
  var upd = {
    ihelpcategoryId: req.body.ihelpcategoryId,
    ihelpcategorytitle: req.body.ihelpcategorytitle,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    English: req.body.English
  };
  var id = req.params.id;
  var upds = { '_id': id };
  Help.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });

  });
}

/**
 * Delete Help 
 */
export const deletehelp = (req, res) => {
  Help.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("HELP_DELETED_SUCCESSFULLY") });
  });
}


/**
 * Add FAQ Category 
 */
export const addfaqcategory = (req, res) => {
  var newData = {
    eStatus: req.body.eStatus,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    language: req.body.language
  }
  const newDoc = new Faqcategory(newData);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("FAQ_CATEGORY_ADDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Get FAQ Category 
 */
export const getfaqcategory = (req, res) => {
  var language = req.query.language ? req.query.language : "en";
  Faqcategory.find({ language: language }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

/**
 * Update FAQ Category 
 */
export const updatefaqcategory = (req, res) => {
  var upd = {
    eStatus: req.body.eStatus,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
  };
  var id = req.params.id;
  var upds = { '_id': id };
  Faqcategory.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });

  });
}

/**
 * Delete FAQ Category 
 */
export const deletefaqcategory = (req, res) => {
  Faqcategory.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("CATEGORY_DELETED_SUCCESSFULLY") });
  });
}


/**
 * Add  Help Category 
 */
export const addhelpcategory = (req, res) => {
  var newData = {
    eStatus: req.body.eStatus,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    language: req.body.language
  }
  const newDoc = new Helpcategory(newData);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("HELP_CATEGORY_ADDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Get help Category 
 */
export const gethelpcategory = (req, res) => {
  var language = req.query.language ? req.query.language : "en";
  Helpcategory.find({ language: language }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

/**
 * Update FAQ Help Category 
 */
export const updatehelpcategory = (req, res) => {
  var upd = {
    eStatus: req.body.eStatus,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
  };
  var id = req.params.id;
  var upds = { '_id': id };
  Helpcategory.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });

  });
}
/**
 * Delete Help Category 
 */
export const deletehelpcategory = (req, res) => {
  Helpcategory.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("CATEGORY_DELETED_SUCCESSFULLY") });
  });
}


/**
 * All pages content (CMS)
 */
export const addPageContent = (req, res) => {
  const newDoc = new Pages(req.body);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json(err);
    }
    return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), docs });
  })
}

export const getPageContent = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 50;
  likeQuery['language'] = { '$eq': "en" };
  if (req.query.language == "es") likeQuery['language'] = { '$eq': "es" };

  let TotCnt = Pages.find(likeQuery).count();
  let Datas = Pages.find(likeQuery, { "key": 0 }).skip(pageQuery.skip).limit(pageQuery.take);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

export const updatePageContent = (req, res) => {
  var upd = {
    title: req.body.title,
    section: req.body.section,
    desc: req.body.desc,
    link: req.body.link,
    // language: req.body.language
  };
  var id = req.body._id;
  var upds = { '_id': id };
  Pages.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });
  });
}


/**
 * Our Drivers Part on home page
 */

export const addOurDriver = (req, res) => {
  var filename = "";
  if (req['file'] != null) {
    filename = req['file'].path;
    req.body.image = filename;
  }
  const newDoc = new OurDrivers(req.body);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json(err);
    }
    return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_ADDED_SUCCESSFULLY"), docs });
  })
}

export const getOurDriver = (req, res) => {

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 50;
  likeQuery['language'] = "en";
  if (req.query.language == "es") likeQuery['language'] = "es";
  OurDrivers.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  OurDrivers.find(likeQuery, { key: 0 }).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}

export const updateOurDriver = (req, res) => {
  var filename = "";
  if (req['file'] != null) {
    filename = req['file'].path;
    req.body.image = filename;
  }
  if (req.body.file) {
    req.body.image = req.body.file;
  }

  const updateDoc = new OurDrivers(req.body);
  var id = req.body._id;
  var upds = { '_id': id };
  OurDrivers.updateOne(upds, updateDoc, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_UPDATED_SUCCESSFULLY"), 'data': docs });

  });
}

export const deleteOurDriver = (req, res) => {
  OurDrivers.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_DELETED_SUCCESSFULLLY") });
  });
}


export const getSections = (req, res) => {
  var language = config.appDefaultLanguageCode;
  if (req.query.language) language = req.query.language;
  Pages.find({ section: req.params.type, language: language }, { _id: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }

    res.send(docs);
  });
}


export const getCatsFaq = (req, res) => {
  var language = config.appDefaultLanguageCode;
  if (req.query.language) language = req.query.language;
  Faq.find({ ifaqcategoryId: req.params.id, language: language }, { _id: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }

    res.send(docs);
  });
}


export const getCatshelp = (req, res) => {
  var language = config.appDefaultLanguageCode;
  if (req.query.language) language = req.query.language;
  Help.find({ ihelpcategoryId: req.params.id, language: language }, { _id: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }

    res.send(docs);
  });
}


/**
 * Send Mail to Admin
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const webContactUs = async (req, res) => {
  var companymail = config.contactmail;
  var citywiseData = await cityWiseOffice.findOne({ "scIds.scId": req.body.scId }).exec();
  // if (citywiseData) companymail = config.companymail;

  const newDoc = new WebContactUs(req.body);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    var mailid = req.body.mailid;
    var subject = req.body.subject;
    // HelperFunc.sendToMail(mailid, template, subject);

    var body = {
      subject: req.body.subject,
      message: req.body.detail,
      from: req.body.fname + " " + req.body.lname,
      fromId: req.body.phone,
      mail: req.body.mailid,
      location:citywiseData.address ? citywiseData.address : "-",
      type: "From Web -  Query"
    }
    sendEmail(companymail, body, 'userQuery')

    return res.json({ 'success': true, 'message': req.i18n.__("MESSAGE_SENDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Update Footer Section 
 */
export const updateFooter = (req, res) => {
  var language = req.query.language ? req.query.language : "en";
  EditHomeContent.findOne({ language: language }, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var updateData = docs;
    updateData.contactAdd = req.body.contactAdd;
    updateData.contactNo = req.body.contactNo;
    updateData.contactEmail = req.body.contactEmail;
    updateData.driver_link_Android = req.body.driver_link_Android;
    updateData.rider_link_Android = req.body.rider_link_Android;
    updateData.driver_link_Ios = req.body.driver_link_Ios;
    updateData.rider_link_Ios = req.body.rider_link_Ios;
    updateData.social_link_facebook = req.body.social_link_facebook;
    updateData.social_link_twitter = req.body.social_link_twitter;
    updateData.driver_link_Google = req.body.driver_link_Google;
    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': op.EditHomeContent });
    });
  })
}


export const listHelpCategory = (req, res) => {
  Helpcategory.find({}, {}, { 'sort': { "iDisplayOrder": 1 } }, async function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    let template = await supportPageCategoriesList(doc)
    return res.send(template)
  })
}

function supportPageCategoriesList(data) {
  var topHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <title>${config.appName}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
  
  
  </head>
  <body>
  <style type="text/css">
      ul{padding:0px;}
      ul li {
      list-style-type: none;
      padding: 8px 0px;
      border-top: 1px solid #ccc;
      padding-left:10px;
  }
      ul li span.fa.fa-angle-right {
      float: right;
      padding-right: 10px;
      font-size: 24px;
      margin-top: -3px;
      color: #9f9f9f;
  }
  a{color:#000;text-decoration:unset;}
  a:hover, a:focus{text-decoration:unset;color:#000;}
  ul li:last-child{border-bottom:1px solid #ccc;}
  </style>
  <div class="container" style="padding:0px">
  
  <div class="col-xs-12 col-sm-12 col-md-12" style="padding:0px">
  <div class="title">
  <div style="display:flex;padding: 5px 8px;"><sapn style="font-size: 17px;margin-top:3px;padding-top: 0;display: inline-block;">Help</sapn></div>
  </div>
  <ul>`;
  var bottomHtml = `</ul>
  </div>
  
  </div>
  </body>
  
  </html>`;

  var innerHtml = '';
  for (var i = 0; i < data.length; i++) {
    innerHtml = innerHtml + '<li><a href=' + config.baseurl + 'api/webView/helpPage/' + data[i]._id + '>' + data[i].vTitle_EN + '<span class="fa fa-angle-right"></span></a></li>'
  }
  innerHtml = innerHtml + `<li><a href=` + config.baseurl + `api/tnc> Terms & Condition <span class="fa fa-angle-right"></span></a></li> 
  <li><a href=`+ config.baseurl + `api/aboutus>About Us <span class="fa fa-angle-right"></span></a></li>
  <li><a href=`+ config.baseurl + `api/privacypolicy> Privacy Policy<span class="fa fa-angle-right"></span></a></li>`;

  return topHtml + innerHtml + bottomHtml;

  //<li><a href="">Signing Up, Account @ Login <span class="fa fa-angle-right"></span></a></li>
}

export const listHelpPage = (req, res) => {
  Help.aggregate([
    { "$match": { 'ihelpcategoryId': req.params.id } },
    // {"$lookup":{
    //   "from"         : "helpcategorys",
    //   "localField"   : "ihelpcategoryId",
    //   "foreignField" : "_id",
    //   "as"           : "categoriesInfo"
    // }},
    // {"$unwind" : "$categoriesInfo"},
    { "$sort": { "iDisplayOrder": 1 } },
    {
      "$group": {
        '_id': "$ihelpcategoryId",
        'categoryName': { "$first": "$ihelpcategorytitle" },
        'supportPage': {
          "$push": {
            'question': "$vTitle_EN",
            'answer': "$English",
            'displayOrder': "$iDisplayOrder",
          }
        }
      }
    }
  ], async function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    let template = await supportPageList(doc[0])
    return res.send(template)
  })
}

function supportPageList(data) {
  var topHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <title>${config.appName}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
    <script>
    function goBack() {
     window.history.back();
    }
    </script>
  
  </head>
  
  <body>
  <!------ Include the above in your HEAD tag ---------->
  <style type="text/css">
    .panel-group .panel+.panel{margin:0px;}
    .panel-default>.panel-heading {
      color: #333;
      background-color: #ffffff;
      border-color: #ddd;
  }
  a:hover, a:focus{text-decoration:unset;}
  h2 {
      font-family: Arial, Verdana;
      font-weight: 800;
      font-size: 2.5rem;
      color: #091f2f;
      text-transform: uppercase;
  }
  .accordion-section .panel-default > .panel-heading {
      border: 0;
      background: #f4f4f4;
      padding: 0;
  }
  .accordion-section .panel-default .panel-title a {
    display:block;
    width:100%;
    font-style: normal;
    font-size: 1.5rem;
    padding: 10px 10px;
    text-decoration:unset;
    background-color:#fff;
   
  
  }
  .accordion-section .panel-default .panel-title a:hover{text-decoration:unset;}
  .accordion-section .panel-default .panel-title a span{  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 100%;
    max-width: 280px;
    text-decoration:unset;
  }
  .panel.panel-default{border-bottom:0px;background-color:#fff;}
  .accordion-section .panel-default .panel-title a:after {
      font-family: 'FontAwesome';
      font-style: normal;
      font-size: 3rem;
      content: "\f106";
      color: #9f9f9f;
      float: right;
      margin-top: -12px;
  }
  .accordion-section .panel-default .panel-title a.collapsed:after {
      content: "\f107";
  }
  .accordion-section .panel-default .panel-body {
      font-size: 1.2rem;
  }
  </style>  
  <div class="container" style="padding:0px;">
  <div class="title">
  <div style="display:flex;padding: 5px 8px;"><span onclick="goBack()" class="fa fa-angle-left" style="font-weight: bold;font-size: 27px;padding-right: 13px;"></span style="font-weight:bold;"><sapn style="font-size: 17px;margin-top:3px;padding-top: 0;display: inline-block;">`+ data.categoryName + `</sapn></div>
  </div>
  
  <section class="accordion-section clearfix mt-3" aria-label="Question Accordions">
      <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">`

  var bottomHtml = `</div>
  </section>

  <script type="text/javascript">
    
  </script>
  </body>
  </html>`;

  var innerHtml = '';
  for (var i = 0; i < data.supportPage.length; i++) {
    innerHtml = innerHtml + `
      <div class="panel panel-default">
        <div class="panel-heading p-3 mb-3" role="tab" id="heading`+ i + `">
        <h3 class="panel-title">
          <a class="collapsed" role="button" title="" data-toggle="collapse" data-parent="#accordion" href="#collapse`+ i + `" aria-expanded="true" aria-controls="collapse` + i + `">
          <span>`+ data.supportPage[i].question + `</span>
          </a>
        </h3>
        </div>
        <div id="collapse`+ i + `" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading` + i + `">
        <div class="panel-body px-3 mb-4">
          <p>`+ data.supportPage[i].answer + `</p>
        </div>
        </div>
      </div>`
  }
  return topHtml + innerHtml + bottomHtml;
}
