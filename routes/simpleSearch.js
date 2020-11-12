const express = require("express");
const router = express.Router();
var rets = require("rets-client");
var fs = require("fs");
var photoSourceId = "12345";

const clientSettings = {
  loginUrl: " http://retsgw.flexmls.com:80/rets2_3/Login",
  username: "cr.rets.nakturnal",
  password: "pappy-dermatous78",
  version: "RETS/1.7.2",
  userAgent: "RETS node-client/4.x",
  method: "GET", // this is the default, or for some servers you may want 'POST'
};

router.get("/", function (req, res) {
  const street = req.query.street ? req.query.street : "";
  const city = req.query.city ? req.query.city : "";
  const maxPrice = req.query.maxPrice ? req.query.maxPrice : "";
  const zipCode = req.query.zipCode ? req.query.zipCode : "";
  res.status(200).send("Express Server Running");
  rets
    .getAutoLogoutClient(clientSettings, function (client) {
      return client.metadata.getResources().then(function (fields) {
        //perform a query using DMQL2 -- pass resource, class, and query, and options
        return client.search
          .query("Property", "A", "(LIST_22=1800+)", {
            limit: 10,
            offset: 1,
          })
          .then(function (searchData) {
            console.log(searchData);
          });
      });
    })
    .catch(function (errorInfo) {
      var error = errorInfo.error || errorInfo;
      console.log("   ERROR: issue encountered:");
      outputFields(error);
      console.log("   " + (error.stack || error).replace(/\n/g, "\n   "));
    });
});

function outputFields(obj, opts) {
  if (!obj) {
    console.log("      " + JSON.stringify(obj));
  } else {
    if (!opts) opts = {};

    var excludeFields;
    var loopFields;
    if (opts.exclude) {
      excludeFields = opts.exclude;
      loopFields = Object.keys(obj);
    } else if (opts.fields) {
      loopFields = opts.fields;
      excludeFields = [];
    } else {
      loopFields = Object.keys(obj);
      excludeFields = [];
    }
    for (var i = 0; i < loopFields.length; i++) {
      if (excludeFields.indexOf(loopFields[i]) != -1) {
        continue;
      }
      if (typeof obj[loopFields[i]] == "object") {
        console.log(
          "      " + loopFields[i] + ": " + JSON.stringify(obj[loopFields[i]], null, 2).replace(/\n/g, "\n      ")
        );
      } else {
        console.log("      " + loopFields[i] + ": " + JSON.stringify(obj[loopFields[i]]));
      }
    }
  }
  console.log("");
}

module.exports = router;

// .then(function (data) {
//   console.log("======================================");
//   console.log("========  Resources Metadata  ========");
//   console.log("======================================");
//   console.log("   ~~~~~~~~~ Header Info ~~~~~~~~~");
//   outputFields(data.headerInfo);
//   console.log("   ~~~~~~ Resources Metadata ~~~~~");
//   outputFields(data.results[0].info);
//   for (var dataItem = 0; dataItem < data.results[0].metadata.length; dataItem++) {
//     console.log("   -------- Resource " + dataItem + " --------");
//     outputFields(data.results[0].metadata[dataItem], {
//       fields: ["ResourceID", "StandardName", "VisibleName", "ObjectVersion"],
//     });
//   }
// })
// .then(function () {
//   //get class metadata
//   return client.metadata.getClass("Property");
// })
// .then(function (data) {
//   console.log("===========================================================");
//   console.log("========  Class Metadata (from Property Resource)  ========");
//   console.log("===========================================================");
//   console.log("   ~~~~~~~~~ Header Info ~~~~~~~~~");
//   outputFields(data.headerInfo);
//   console.log("   ~~~~~~~~ Class Metadata ~~~~~~~");
//   outputFields(data.results[0].info);
//   for (var classItem = 0; classItem < data.results[0].metadata.length; classItem++) {
//     console.log("   -------- Table " + classItem + " --------");
//     outputFields(data.results[0].metadata[classItem], {
//       fields: ["ClassName", "StandardName", "VisibleName", "TableVersion"],
//     });
//   }
// })
//   .then(function () {
//     //get field data for open houses
//     return client.metadata.getTable("Property", "A");
//   })
//   .then(function (data) {
//     console.log("==============================================");
//     console.log("========  Residential Table Metadata  ========");
//     console.log("===============================================");
//     console.log("   ~~~~~~~~~ Header Info ~~~~~~~~~");
//     outputFields(data.headerInfo);
//     console.log("   ~~~~~~~~ Table Metadata ~~~~~~~");
//     console.log(data.results[0].metadata);
//     outputFields(data.results[0].info);
//     // const FieldsList = [];
//     // for (let i = 200; i < 207; i++) {
//     //   FieldsList.push({
//     //     SystemName: data.results[0].metadata[i].SystemName,
//     //     ShortName: data.results[0].metadata[i].ShortName,
//     //     LongName: data.results[0].metadata[i].LongName,
//     //     DataType: data.results[0].metadata[i].DataType,
//     //   });
//     // }
//     // console.log(FieldsList);
//     for (var tableItem = 0; tableItem < data.results[0].metadata.length; tableItem++) {
//       console.log("   -------- Field " + tableItem + " --------");
//       outputFields(data.results[0].metadata[tableItem], {
//         fields: ["MetadataEntryID", "SystemName", "ShortName", "LongName", "DataType"],
//       });
//     }
//     return data.results[0].metadata;
//   })
//   .then(function (fieldsData) {
//     var plucked = [];
//     for (var fieldItem = 0; fieldItem < fieldsData.length; fieldItem++) {
//       plucked.push(fieldsData[fieldItem].SystemName);
//     }
//     return plucked;
//   })
// .then(function () {
//   // get photos
//   return client.objects.getAllObjects("Property", "LargePhoto", photoSourceId, {
//     alwaysGroupObjects: true,
//     ObjectData: "*",
//   });
// })
// .then(function (photoResults) {
//   console.log("=================================");
//   console.log("========  Photo Results  ========");
//   console.log("=================================");
//   console.log("   ~~~~~~~~~ Header Info ~~~~~~~~~");
//   outputFields(photoResults.headerInfo);
//   for (var i = 0; i < photoResults.objects.length; i++) {
//     console.log("   -------- Photo " + (i + 1) + " --------");
//     if (photoResults.objects[i].error) {
//       console.log("      Error: " + photoResults.objects[i].error);
//     } else {
//       outputFields(photoResults.objects[i].headerInfo);
//       fs.writeFileSync(
//         "/tmp/photo" + (i + 1) + "." + photoResults.objects[i].headerInfo.contentType.match(/\w+\/(\w+)/i)[1],
//         photoResults.objects[i].data
//       );
//     }
//   }
// });
