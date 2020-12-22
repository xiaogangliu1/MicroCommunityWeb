/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeSummaryInfo: {
                fees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                roomUnits: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._initDate();
            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);

            // vc.initDateMonth('startTime', function (_startTime) {
            //     $that.reportFeeSummaryInfo.conditions.startTime = _startTime;
            // });

            // vc.initDateMonth('endTime', function (_endTime) {
            //     $that.reportFeeSummaryInfo.conditions.endTime = _endTime;
            //     let start = Date.parse(new Date($that.reportFeeSummaryInfo.conditions.startTime + "-01"))
            //     let end = Date.parse(new Date($that.reportFeeSummaryInfo.conditions.endTime + "-01"))
            //     if (start - end >= 0) {
            //         vc.toast("结束时间必须大于开始时间")
            //         $that.reportFeeSummaryInfo.conditions.endTime = '';
            //     }
            // });

        },
        _initEvent: function () {

            vc.on('reportFeeSummary', 'chooseFloor', function (_param) {
                vc.component.reportFeeSummaryInfo.conditions.floorId = _param.floorId;
                vc.component.reportFeeSummaryInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);

            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".startTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.reportFeeSummaryInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.reportFeeSummaryInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.reportFeeSummaryInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.reportFeeSummaryInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.reportFeeSummaryInfo.conditions.endTime = '';
                        }
                    });
            },
            _queryMethod: function () {
                vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listFees: function (_page, _rows) {

                vc.component.reportFeeSummaryInfo.conditions.page = _page;
                vc.component.reportFeeSummaryInfo.conditions.row = _rows;
                vc.component.reportFeeSummaryInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFeeSummaryInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryReportFeeSummary',
                    param,
                    function (json, res) {
                        var _reportFeeSummaryInfo = JSON.parse(json);
                        vc.component.reportFeeSummaryInfo.total = _reportFeeSummaryInfo.total;
                        vc.component.reportFeeSummaryInfo.records = _reportFeeSummaryInfo.records;
                        vc.component.reportFeeSummaryInfo.fees = _reportFeeSummaryInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportFeeSummaryInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            loadUnits: function (_floorId) {
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.get(
                    'room',
                    'loadUnits',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let tmpUnits = JSON.parse(json);
                            vc.component.reportFeeSummaryInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },

            _openChooseFloorMethod:function(){
                vc.emit('searchFloor','openSearchFloorModel',{});
            },
            _exportFee:function(){
                vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId='+vc.getCurrentCommunity().communityId+"&pagePath=reportFeeSummary");
            }
        }
    });
})(window.vc);
