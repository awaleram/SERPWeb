'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.controller',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/home', {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl'
      })
      .when('/corpusChange', {
        templateUrl: 'views/corpusChange.html',
        controller: 'corpusChangeCtrl'
      })
      .when('/socialCorpusChange', {
        templateUrl: 'views/socialCorpusChange.html',
        controller: 'socialCorpusChangeCtrl'
      })
      .when('/trendByGeographyCorpus', {
        templateUrl: 'views/trendByGeographyCorpus.html',
        controller: 'trendByGeographyCorpusCtrl'
      })
      .when('/changeInGrading', {
        templateUrl: 'views/changeInGrading.html',
        controller: 'changeInGradingCtrl'
      })

      .when('/OverDueLoans', {
        templateUrl: 'views/overDueLoans.html',
        controller: 'overDueLoansCtrl'
      })
      .when('/NPALoans', {
        templateUrl: 'views/overDueNPALoanAmount.html',
        controller: 'overDueNPAAmountCtrl'
      })
      .when('/ActivityBasedLendingCount', {
          templateUrl: 'views/activityBasedLendingCount.html',
          controller: 'activityBasedLendingCountCtrl'
      })
      .when('/ActivityBasedLendingAmount', {
          templateUrl: 'views/activityBasedLendingAmount.html',
          controller: 'activityBasedLendingAmountCtrl'
      })
      .when('/RatioofIGAtoConsumption', {
          templateUrl: 'views/ratioofIGAtoConsumption.html',
          controller: 'ratioofIGAtoConsumptionCtrl'
      })

      .when('/UnutilizedCCL', {
          templateUrl: 'views/unutilizedCCL.html',
          controller: 'unutilizedCCLCtrl'
      })

      .when('/LoansforIncomeGenerationPurpose', {
          templateUrl: 'views/loansforIncomeGenerationPurpose.html',
          controller: 'loansforIncomeGenerationPurposeCtrl'
      })
      .when('/LoanAmountIGA', {
          templateUrl: 'views/loanAmountIGA.html',
          controller: 'loanAmountIGACtrl'
      })
      .when('/LoanAmountPercentageIGA', {
          templateUrl: 'views/loanAmountPercentageforIncomeGenerationPurpose.html',
          controller: 'loanAmountPercentageforIncomeGenerationPurposeCtrl'
      })
      .when('/shgEligibleForVlr',{
          templateUrl: 'views/shgEligibleForVlr.html',
          controller: 'shgEligibleForVlrController'
      })
      .when('/EligibleShgForVLRByBankWise', {
          templateUrl: 'views/eligibleShgForVLRByBankWise.html',
          controller: 'eligibleShgForVLRByBankWiseController'
      })
      .when('/EligibleLoanAccForVlrByBankWise',{
          templateUrl: 'views/eligibleLoanAccForVlrByBankWise.html',
          controller: 'eligibleLoanAccForVlrByBankWiseController'
      })
      .when('/CountOfLoanAccForIneligibleReason',{
          templateUrl: 'views/countOfLoanAccForIneligibleReason.html',
          controller: 'countOfLoanAccForIneligibleReasonController'
      })
      .when('/EligibleLoanAccForVlrByDistMandleWise',{
          templateUrl : 'views/eligibleLoanAccForVlrByDistMandalWise.html',
          controller: 'eligibleLoanAccForVlrByDistMandalWiseController'
      })
      .when('/CountOfLoanAccForIneligibleReasonByDistMandleWise',{
          templateUrl : 'views/countOfLoanAccForIneligibleReasonByDistMandleWise.html',
          controller: 'countOfLoanAccForIneligibleReasonByDistMandleWiseController'
      })
      .otherwise({
        redirectTo: '/home'
      });
}]).factory('Base64', function() {
  var keyStr = 'ABCDEFGHIJKLMNOP' +
      'QRSTUVWXYZabcdef' +
      'ghijklmnopqrstuv' +
      'wxyz0123456789+/' +
      '=';
  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
        "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };
})
    .directive('sidebarDirective', function() {
      return {
        link : function(scope, element, attr) {
          scope.$watch(attr.sidebarDirective, function(newVal) {
            if(newVal)
            {
              element.addClass('show');
              return;
            }
            element.removeClass('show');
          });
        }
      };
    });
