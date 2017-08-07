//WEBPACK_CONIFG_HOST的值，在webpack.config.js中更改
//开发环境时 = "http://amptest.wisedu.com/xsfwfw/"
//发布环境时 = location.origin + location.pathname.substring(0, location.pathname.indexOf("/", 1)) + "/"

export default {
	yyfx: WEBPACK_CONIFG_HOST + "sys/appstoreservice/sjzds/yyfx.do", //应用类型(字典表)
	// schools: WEBPACK_CONIFG_HOST + "sys/appstoreservice/sjzds/schools.do",
	appsLbtList: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/lbtList.do", //轮播图
	appsRmyyList: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/rmyyList.do", //热门应用
	appsZxyyList: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/zxyyList.do", //最新应用
	appsKhalList: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/khalList.do", //客户案例
	appsList: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/list.do", //搜索模糊查询应用
	appsDetail: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/detail.do", //应用详情
	appsIntrodure: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/introdure.do", //获取应用介绍
	appsCustomer: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/customer.do", //客户案例信息
	appsCount: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/appscount.do", //学校应用统计，服务学校列表
	addBill: WEBPACK_CONIFG_HOST + "sys/appstoreservice/bills/addBill.do", //加入清单
	billsList: WEBPACK_CONIFG_HOST + "sys/appstoreservice/bills/list.do", //我的清单
	deleteBills: WEBPACK_CONIFG_HOST + "sys/appstoreservice/bills/deleteBills.do",
	quotationsList: WEBPACK_CONIFG_HOST + "sys/appstoreservice/quotations/list.do",
	addQuotation: WEBPACK_CONIFG_HOST + "sys/appstoreservice/quotations/addQuotation.do",
	deleteQuotaition: WEBPACK_CONIFG_HOST + "sys/appstoreservice/quotations/deleteQuotaition.do",
	quotationsDetails: WEBPACK_CONIFG_HOST + "sys/appstoreservice/quotations/details.do",
	getImageSrc: WEBPACK_CONIFG_HOST + "sys/appstoreservice/attrs/preview.do",
	getUserInfo: WEBPACK_CONIFG_HOST + "sys/appstoreservice/users/login.do",
	appYyflSum: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/yyflSum.do", //应用类型(应用数)
	saveUserInfo: WEBPACK_CONIFG_HOST + "sys/appstoreservice/users/saveUserInfo.do", //保存联系人的信息
	loginUserInfo: WEBPACK_CONIFG_HOST + "sys/appstoreservice/users/loginUserInfo.do", //查询联系人的信息
	appBq: WEBPACK_CONIFG_HOST + "sys/appstoreservice/sjzds/roleBq.do", //标签类型
	checkBills: WEBPACK_CONIFG_HOST + "sys/appstoreservice/bills/checkBills.do", //检查是否已经加入清单
	zdyTab: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/zdyTab.do", //自定义tab
	zdyList: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/zdyList.do", //自定义tab内应用
	sysSetting: WEBPACK_CONIFG_HOST + "sys/appstoreservice/syssetting/setting.do", //查询系统设置的电话
	staticsOfShareApp: WEBPACK_CONIFG_HOST + "sys/appstoreservice/users/shareCount.do", //获取分享统计数据
	//新
	queryBjdInWechat: WEBPACK_CONIFG_HOST + "sys/appstoreservice/quotations/wxDetails.do", //查询报价单属性及详情
	queryCustom: WEBPACK_CONIFG_HOST + "sys/appstoreservice/apps/wxCustomer.do", //查询案例属性及详情
}