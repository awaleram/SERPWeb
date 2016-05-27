


(function () {
    'use strict';
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var app= angular.module('myApp.controller');
    app.controller('eligibleLoanAccForVlrByBankWiseController', ['Base64', '$scope', '$http', function(Base64, $scope, $http) {


        $scope.banks =[];
        $scope.bankBranches = [];


        $scope.showFilter = true;
        $scope.showBank = true;
        $scope.homeshow = true;
        $scope.resultshow = false;
        $scope.showBankBranches = false;


        $scope.bank_name = -1;
        $scope.ifsc_code = -1;



        $scope.startdate = '';
        $scope.enddate = '';
        var d=new Date(); // current date
        d.setDate(1); // going to 1st of the month
        d.setHours(-1);

        $scope.enddate = moment().subtract(1,'months').endOf('month').format('DD-MMM-YYYY');
        $scope.startdate = moment().subtract(6,'months').startOf('month').format("DD-MMM-YYYY");
        var options = {};




        //following is submit function it will call the eligibleShgForVlrByBankWise report

        $scope.submit= function(){

            var startDate = moment($scope.startdate, "DD-MMM-YYYY").format("YYYY-MM-DD");
            var endDate = moment($scope.enddate, "DD-MMM-YYYY").format("YYYY-MM-DD");
            $scope.filterText = '';
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');

            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/Eligible%20Loan%20Accounts%20for%20VLR%20in%20percentage%20terms%20Bank%20and%20Branch%20wise?tenantIdentifier=default&R_startDate=' + startDate + '&R_endDate=' + endDate + '&locale=en&R_bank_name=' + $scope.bank_name + '&R_ifsc_code=' + $scope.ifsc_code).success(function (data) {
                $scope.resultshow = true;
                $scope.report = data;
                $scope.reportHeaders = data.columnHeaders;
                $scope.reportHeaderValues = [];
                var reportDataValues = [];
                var reportDataValues2 = [];
                for (var i = 0; i < $scope.report.data.length; i++) {

                    $scope.report.data[i].row[1] = parseFloat($scope.report.data[i].row[1]).toFixed(2);
                    //  $scope.report.data[i].row[2] = numberWithCommas($scope.report.data[i].row[2]);
                    /*  $scope.report.data[i].row[3] = numberWithCommas($scope.report.data[i].row[3]);
                     $scope.report.data[i].row[4] = parseFloat($scope.report.data[i].row[4]).toFixed(2);
                     $scope.report.data[i].row[5] = parseFloat($scope.report.data[i].row[5]).toFixed(2);*/
                    //$scope.report.data[i].row[3] = $scope.report.data[i].row[3].toFixed(2);

                    $scope.reportHeaderValues.push($scope.report.data[i].row[0]);
                    reportDataValues.push({
                        y: parseFloat($scope.report.data[i].row[1])
                    });
                    reportDataValues2.push({
                            y: parseFloat($scope.report.data[i].row[1])
                        }
                    );
                }

                options = {
                    chart: {
                        height: 300
                    },
                    title: {
                        text: '% of Eligible Loan Accounts for VLR'
                    },
                    xAxis: {
                        categories: $scope.reportHeaderValues
                    },

                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: $scope.headerValue,
                        data: reportDataValues
                    }]
                };
                options.chart.renderTo = 'container10';
                options.chart.type = 'line';
                var chart1 = new Highcharts.Chart(options);
            });
        }

        //following function called when click on submit date
        $scope.submitDate = function(){
            $scope.submit(); // function call for submit to get report
            $scope.getAllBanks();
        };


        //following function called if graph want to show in line
        $scope.chartLine= function(){
            options.chart.type = 'line';
            var chart1 = new Highcharts.Chart(options);
        };

        //following function called if graph want to show in bar
        $scope.chartBar= function(){
            options.chart.type = 'column';
            var chart1 = new Highcharts.Chart(options);
        };


        //following function is for getting all banks

        $scope.getAllBanks = function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/GetAllBanks?tenantIdentifier=default&locale=en').success(function (data) {
                $scope.banks= [];

                for (var i = 0; i < data.data.length; i++) {
                    $scope.banks.push({
                        //       id: data.data[i].row[0],
                        name: data.data[i].row[0]
                    });
                }
            });
        };

        //following function for get branches for branch

        $scope.getBranchesForBank = function(){

            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');

            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/GetBankBranches?tenantIdentifier=default&R_bank_name=' + $scope.bank_name + '&locale=en').success(function (data) {

                $scope.bankBranches = [];
                $scope.showBankBranches = true;
                for (var i = 0; i < data.data.length; i++) {
                    $scope.bankBranches.push({
                        name: data.data[i].row[0],
                        ifsc_code: data.data[i].row[1]

                    });
                }

            });
        }


        //following function called if want to get branches of perticular branch

        $scope.submitBanks = function(bankName){

            $scope.bank_name = bankName;
            $scope.headerValue = $scope.bank_name;
            $scope.showBank = false; // here we are getting branch data

            $scope.submit();
            $scope.getBranchesForBank();
            $scope.showBack = true;
            $scope.showBankBranches = false;
        };



        //following function used to call the report for perticular branch

        $scope.submitBranch = function(branchName,ifscCode){

            $scope.branch_name = branchName;
            $scope.ifsc_code = ifscCode;
            $scope.reportHeaderValues = $scope.branch_name;
            $scope.submit();

            $scope.showBankBranches = true;
            $scope.showBack = true;
            $scope.showBank = false;

        }

        //following function call for back

        $scope.back=function(){

            if($scope.ifsc_code = -1){
                $scope.bank_name = -1;
                $scope.showBank = true;
                $scope.showBankBranches = false;
                $scope.submit();
            }

        }

        $scope.submit();
        $scope.getAllBanks();
    }])
}());

