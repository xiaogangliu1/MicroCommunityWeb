/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            repairPoolManageInfo: {
                repairPools: [],
                total: 0,
                records: 1,
                moreCondition: false,
                repairName: '',
                repairSettings: [],
                states: [],
                conditions: {
                    repairId: '',
                    repairName: '',
                    tel: '',
                    repairType: '',
                    roomId: '',
                    roomName: '',
                    ownerId: '',
                    state: ''
                }
            }
        },
        _initMethod: function () {
            //vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            //vc.component._validateParam();
            $that._listRepairSettings();
            vc.getDict('r_repair_pool',"state",function(_data){
                vc.component.repairPoolManageInfo.states = _data;
            });
        },
        _initEvent: function () {

            vc.on('repairPoolManage', 'listRepairPool', function (_param) {
                vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRepairPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRepairPools: function (_page, _rows) {
                vc.component.repairPoolManageInfo.conditions.page = _page;
                vc.component.repairPoolManageInfo.conditions.row = _rows;
                vc.component.repairPoolManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                vc.component.repairPoolManageInfo.conditions.state = '1000';
                var param = {
                    params: vc.component.repairPoolManageInfo.conditions
                };

                //发送get请求
                vc.http.get('repairPoolManage',
                    'list',
                    param,
                    function (json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        vc.component.repairPoolManageInfo.total = _repairPoolManageInfo.total;
                        vc.component.repairPoolManageInfo.records = _repairPoolManageInfo.records;
                        vc.component.repairPoolManageInfo.repairPools = _repairPoolManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.repairPoolManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRepairPoolModal: function () {
                vc.emit('addRepairPool', 'openAddRepairPoolModal', vc.component.repairPoolManageInfo.conditions);
            },
            _openEditRepairPoolModel: function (_repairPool) {
                _repairPool.roomName = vc.component.repairPoolManageInfo.conditions.roomName;
                _repairPool.roomId = vc.component.repairPoolManageInfo.conditions.roomId;
                vc.emit('editRepairPool', 'openEditRepairPoolModal', _repairPool);
            },
            _openDeleteRepairPoolModel: function (_repairPool) {
                vc.emit('deleteRepairPool', 'openDeleteRepairPoolModal', _repairPool);
            },
            _queryRepairPoolMethod: function () {
                vc.component._listRepairPools(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openDispatchRepair: function (_repairPool) {
                vc.jumpToPage('/admin.html#/pages/property/repairDispatchStep?repairId=' + _repairPool.repairId);

            },
            _moreCondition: function () {
                if (vc.component.repairPoolManageInfo.moreCondition) {
                    vc.component.repairPoolManageInfo.moreCondition = false;
                } else {
                    vc.component.repairPoolManageInfo.moreCondition = true;
                }
            },
            _listRepairSettings: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _repairSettingManageInfo = JSON.parse(json);
                        vc.component.repairPoolManageInfo.repairSettings = _repairSettingManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }


        }
    });
})(window.vc);
