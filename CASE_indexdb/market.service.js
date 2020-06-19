import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ConfigService } from '../shared/services/config.service';
import { HttpService } from '../shared/services/http.service';
import { SocketIoService } from '../shared/services/socket.io.service';
import {
	ClassifiedProductsIF,
	CurrentCatIdIF,
	GetProdTradeDetailReqIF,
	GetProdTradeDetailResIF,
	ProductCatIF,
	ProductIF,
	ProductPriceIF,
	ProductPriceDelayIF,
	TradeDetailInfoIF
} from './market.interface';
import { TranslateService } from '@ngx-translate/core';
import * as math from 'mathjs';

// declare const Window: any;
// indexedDB 对象引用
declare const Window: any, OperatDB;

@Injectable()
export class MarketService {
	/**
	 * 当前分类 id （一级和二级）
	 */
	private currentCatIdSource = new ReplaySubject<CurrentCatIdIF>(1);
	currentCatId: CurrentCatIdIF; // 快照
	currentCatId$ = this.currentCatIdSource.asObservable();

	/**
	 * 当前选择的合约 id
	 */
	private currentProdIdSource = new ReplaySubject<string>(1);
	currentProdId: string; // 快照
	currentProdId$ = this.currentProdIdSource.asObservable();

	/**
	 * 当前选择的持仓 （更换分类）
	 */
	autoChooseCat = new ReplaySubject<string>(1);
	autoChooseCat$ = this.autoChooseCat.asObservable();

	/**
	 * 当前选中的合约明细
	 */
	currentProdDetail: any;

	/**
	 * 当前订阅得合约详细信息
	 */
	private currentProdsSource = new ReplaySubject<ProductIF[]>(1);
	currentProds: ProductIF[] = [];
	currentProds$ = this.currentProdsSource.asObservable();

	private currentProdsSourceDelay = new ReplaySubject<ProductIF[]>(1);
	currentProdsDelay: ProductIF[] = [];
	currentProdsDelay$ = this.currentProdsSourceDelay.asObservable();

	/**
	 * 用户自选合约
	 */
	private favoriteProductsSource = new ReplaySubject<ProductIF[]>(1);
	favoriteProducts: ProductIF[] = []; // 快照
	favoriteProducts$ = this.favoriteProductsSource.asObservable();

	/**
	 * 所有合约分类 & 合约列表
	 */
	prodCats: ProductCatIF[]; // 所有原始分类
	classifiedProdCats: ProductCatIF[]; // 已分类的合约分类
	products: ProductIF[]; // 处理后的所有合约
	classifiedProducts: ClassifiedProductsIF; // 已分类的合约列表
	productIds: string[]; // 所有合约 id 列表
	isFavorite = false; // 当前（跳转之前）是否显示的是 “自选” 页面
	isStock = false; 		// 跳转之前 是否是 ”股票“ 页面

	// 图标主线颜色
	echartsLineColor = {
		color: '',
		subColor: '',
		border: '',
		borderPriceColor: '',
		up: '',
		down: '',
		axis: ''
	};

	// OperatDB 实例化对象
	private operatDB;

	constructor(
		private toastr: ToastrService,
		private config: ConfigService,
		private http: HttpService,
		private socket: SocketIoService,
		public translate: TranslateService
	) {
		this.refreshEchartsSkin();
		// 加载 indexedDB
		this.initIndexedDB();
	}
	/**
	 * 刷新当前图标皮肤
	 */
	refreshEchartsSkin() {
		const skin = localStorage.getItem('skin') || 'black';
		if (skin === 'black' || skin === 'default') {
			this.echartsLineColor.color = '#fff';
			this.echartsLineColor.axis = '#373e47';
			this.echartsLineColor.border = '#373e47';
			this.echartsLineColor.borderPriceColor = '#777';
			this.echartsLineColor.subColor = '#ffff00';
			this.echartsLineColor.up = '#ff0000';
			this.echartsLineColor.down = '#99ffff';
		} else {
			this.echartsLineColor.color = '#111';
			this.echartsLineColor.axis = '#111';
			this.echartsLineColor.border = '#EEF5FE';
			this.echartsLineColor.borderPriceColor = '#ddd';
			this.echartsLineColor.subColor = '#FFC667';
			this.echartsLineColor.up = '#e92a44';
			this.echartsLineColor.down = '#2dbf76';
		}
	}
	/**
	 * 使用合约 id 获取其在列表中的索引值
	 */
	findProdIndex(prodId: string, prodList: ProductIF[]): number {
		for (let i = 0, l = prodList.length; i < l; i++) {
			if (prodList[i].productId === prodId) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 使用分类 id 获取其在列表中的索引值
	 */
	findCatIndex(catId: string, catList: ProductCatIF[]): number {
		for (let i = 0, l = catList.length; i < l; i++) {
			if (catList[i].categoryId === catId) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 使用合约 id 查找其一级分类和二级分类 id
	 */
	findCatIdByProdId(prodId: string): CurrentCatIdIF {
		const _prod = this.getProductByProdId(prodId);
		const _childCatId = _prod.categoryId;
		const _cat = this.getCatByCatId(_childCatId);
		const _parentCatId = _cat.parentCategoryId;
		return {
			parent: _parentCatId,
			child: _childCatId,
			commodityType: _prod.commodityType
		};
	}

	/**
	 * 按照中文拼音首字母排序排序合约列表
	 */
	sortZhByFirstChar(prodList: ProductIF[], ascending: boolean): ProductIF[] {
		// 中文首字母排序方法
		const sort = (a, b) => a.localeCompare(b, 'zh-Hans-CN', {
			sensitivity: 'accent'
		});

		// 排序
		const _names: string[] = [];
		for (let i = 0, l = prodList.length; i < l; i++) {
			_names.push(prodList[i].contractName);
		}
		_names.sort(sort);

		// 映射
		const _newList: ProductIF[] = [];
		for (let i = 0, l = _names.length; i < l; i++) {
			for (let j = 0, k = prodList.length; j < k; j++) {
				if (_names[i] === prodList[j].contractName) {
					_newList.push(prodList[j]);
					break;
				}
			}
		}

		return ascending ? _newList : _newList.reverse();
	}

	/**
	 * 更新当前分类
	 */
	updateCurrentCatId(currentCatId: CurrentCatIdIF) {
		console.log('更新当前分类', currentCatId);
		this.currentCatId = currentCatId;
		this.currentCatIdSource.next(currentCatId);
	}

	/**
	 * 更新当前选择的合约
	 */
	updateCurrentProdId(prodId: string) {
		this.currentProdId = prodId;
		Window.nowProId = prodId;
		this.currentProdIdSource.next(prodId);
	}

	/**
	 * 更新当前订阅得合约列表
	 */
	updateCurrentProds(prods: ProductIF[]) {
		this.currentProds = prods;
		this.currentProdsSource.next(prods);
	}

	updateCurrentProdsDelay(prods: ProductIF[]) {
		this.currentProdsDelay = prods;
		this.currentProdsSourceDelay.next(prods);
	}

	/**
	 * 更新用户自选合约
	 */
	updateFavoriteProducts(prods: ProductIF[]) {
		this.favoriteProducts = prods;
		this.favoriteProductsSource.next(prods);
		this.saveFavoriteProducts();
	}

	addFavoriteProduct(prodId: string) {
		const _index = this.findProdIndex(prodId, this.favoriteProducts);
		const _prod = this.getProductByProdId(prodId);
		if (_index === -1 && _prod) {
			this.favoriteProducts.push(_prod);
			this.favoriteProductsSource.next(this.favoriteProducts);
			this.saveFavoriteProducts();
		}
	}

	deleteFavoriteProduct(prodId: string) {
		const _index = this.findProdIndex(prodId, this.favoriteProducts);
		if (_index !== -1) {
			this.favoriteProducts.splice(_index, 1);
			this.favoriteProductsSource.next(this.favoriteProducts);
			this.saveFavoriteProducts();
		}
	}

	private saveFavoriteProducts() {
		const _userId = localStorage.getItem('userId');
		localStorage.setItem(_userId, JSON.stringify(this.favoriteProducts));
	}

	/**
	 * 缓存分类信息
	 */
	allChildcategory:any = []; //所有二级分类
	/**
	 * 获取所有一级分类
	 */


	/**
	 * 获取指定一级分类下的二级分类
	 * @param catId - 一级分类的 id
	 */
	getParentCats(): Observable<ProductCatIF[] | null> {
		const _url = 'client/config/product/category/top/query/list';
		return this.http.post$(_url, {}).pipe(
			map(res => {
				if (res.code === '000000') {
					return JSON.parse(res.content);
				} else {
					return null;
				}
			})
		);
	}
	getChildCats(catId: string): Observable<ProductCatIF[] | null> {
		const _url = 'client/config/product/category/sub/query';
		const _data = {categoryId: catId};
		return this.http.post$(_url, _data).pipe(
			map(res => {
				if (res.code === '000000') {
					return JSON.parse(res.content);
				} else {
					return null;
				}
			})
		);
	}


	/**
	 *  合约列表-缓存
	 *	V2 接口
	 */
	// 排序
	private changeSort(res) {
		res.sort(function (a, b) {
			if (a.marketVO.marketSort === b.marketVO.marketSort) {
				if (b.commodityVO.commoditySort === a.commodityVO.commoditySort) {
					return a.contractVO.contractSort - b.contractVO.contractSort;
				}
				return a.commodityVO.commoditySort - b.commodityVO.commoditySort;
			}
			return a.marketVO.marketSort - b.marketVO.marketSort;
		});
		return res;
	}

	/**
	 * 缓存合约数据
	 */
	/*
	cacheProducts(): Observable<boolean> {
		// const _url = 'api/v2/cfg/user/symbol/query';
		const _url = 'api/v2/cfg/user/symbol1/query';
		const _data = { 
			"tradeMode": 0, 
			"queryMode": 1, 
			"i18nVersion": -1, 
			"version": -1 
		};
		return this.http.post$(_url, _data).pipe(
			map(res => {
				if(res.code === '000000'){
					console.log('[查看返回的数据列表]', res);
					const sybolsData = this.changeSort(res.content.symbols);
					const categorysData = res.content.categorys;
					const _productItem: ProductIF[] = [];
					const _productIdItem = [];
					const _classifiedProducts = {};
					const _userName = JSON.parse(localStorage.getItem('userInfo')).loginName;	// 用户ID
					// 插入一二级排序 start
					const _cats: ProductCatIF[] = [];
					for(let i=0,r=categorysData.length; i<r; i++){
						if(categorysData[i].categoryLevel === 1 && categorysData[i].tradeMode === 0){
							const _item: ProductCatIF = categorysData[i];
							Object.assign(_item, {children: []});
							_cats.push(_item);
						}
					}
					for(let i=0,r=categorysData.length; i<r; i++){
						if(categorysData[i].categoryLevel === 2 && categorysData[i].tradeMode === 0){
							this.allChildcategory.push(categorysData[i]);
							for(let j = 0, k = _cats.length; j < k; j++){
								if(categorysData[i].parentCategoryId == _cats[j].categoryId){
									_cats[j].children.push(categorysData[i]);
								}
							}
						}
					}
					_cats.sort(this.compare('categorySort'));
					for (let i = 0, r = _cats.length; i < r; i++) {
						_cats[i].children.sort(this.compare('categorySort'));
					}
					this.updateCurrentCatId({
						parent: _cats[0].categoryId,
						child: _cats[0].children[0].categoryId,
						commodityType: _cats[0].children[0].commodityType
					});
					this.prodCats = categorysData;
					this.classifiedProdCats = _cats;
					// 插入一二级排序 end
					for(let i=0,r=sybolsData.length; i<r; i++){
						let dicArr = sybolsData[i];
						if(dicArr.tradeMode.indexOf(0) > -1 && dicArr.contractVO.contractCode){	// 普通模式	
							_productItem.push({
								TOne: dicArr.marketVO.TOne,
								basic: false,
								buyRate: 0,
								categoryId: '',
								categoryIds: '',
								commodityCode: dicArr.commodityVO.commodityCode,
								commodityCurrency: dicArr.commodityVO.commodityCurrency,
								commodityId: dicArr.commodityVO.commodityId,
								commodityName: dicArr.commodityVO.commodityName,
								commoditySort: dicArr.commodityVO.commoditySort,
								commodityState: 0,
								commodityTrade: false,
								commodityType: dicArr.commodityVO.commodityType,
								considerationNum: dicArr.commodityVO.considerationNum,
								contractCode: dicArr.contractVO.contractCode,
								contractId: dicArr.contractVO.contractId,
								// contractName: '',
								// contractName: (dicArr.contractVO.contractCode == '0001') ? dicArr.commodityVO.commodityCode : (dicArr.commodityVO.commodityCode + dicArr.contractVO.contractCode),
								// contractName: dicArr.commodityVO.commodityName + dicArr.commodityVO.commodityCode,
								contractName: dicArr.commodityVO.commodityName,
								contractNum: dicArr.commodityVO.contractNum,
								contractSort: dicArr.contractVO.contractSort,
								contractState: 0,
								currency: 0,
								currencyCode: '',
								currencyGroupId: '',
								depositBalance: 0,
								depositCurrency: 0,
								depositHold: 0,
								depositNormal: dicArr.commodityVO.depositNormal,
								dueDate: 0,
								feeCurrency: 0,
								feeQuota: 0,
								feeType: 0,
								finalDate: 0,
								flowType: 0,
								interest: 0,
								interestCurrency: 0,
								lockFlag: false,
								marketCode: dicArr.marketVO.marketCode,
								marketId: dicArr.marketVO.marketId,
								marketName: dicArr.marketVO.marketName,
								marketSort: dicArr.marketVO.marketSort,
								marketState: 0,
								marketType: 0,
								minPriceDeno: 0,
								minPriceNume: 0, 
								month: 0,
								noticeDate: 0,
								orgCode: dicArr.marketVO.orgCode,
								orgId: dicArr.marketVO.orgId,
								priceGearsNum: dicArr.commodityVO.priceGearsNum,
								productId: dicArr.contractVO.contractId,
								sellRate: 0,
								taxRate: 0,
								tone: dicArr.marketVO.tone,
								tradeRate: 0,
								unionMinPrices: dicArr.commodityVO.unionMinPrices || 0,
								week: 0,
								year: 0,
								QLastPrice: 0,
								isChangeLastPrice: false,
								QAskPrice: 0,
								isChangeAskPrice: 1,
								QAskQty: 0,
								QBidPrice: 0,
								isBidPrice: 1,
								QBidQty: 0,
								QTotalQty: 0,
								QPositionQty: 0,
								QPreClosingPrice: 0, // 昨收
								QChangeValue: 0, // 涨跌
								QChangeRate: '0', // 涨幅
								QOpeningPrice: 0, // 开盘
								QHighPrice: 0, // 最高
								QLowPrice: 0, // 最低
								Stamp: 0, // 时间
								QSwing: 0, // 振幅
								commodityAbb: dicArr.commodityAbb,
								minOrderVol: dicArr.commodityVO.minOrderVol,
								depositNormalMode: dicArr.commodityVO.depositNormalMode,
								depositMode: dicArr.commodityVO.depositMode, 
								QTotalTurnover: 0,
								SignChangeRate: 0, 
								QTotalBidQty: 0,
								QTotalAskQty: 0,
								QInsideQty: 0,
								QOutsideQty: 0
							});
							// id 合集
							_productIdItem.push(dicArr.contractVO.contractId);
						}
					}	
					// 所有合约
					Window.getAllcontractList = _productItem;
					// 获取 _classifiedProducts 值
					for(let i=0,r=_productItem.length; i<r; i++){
						for(let j=0, r=categorysData.length; j<r; j++){
							if(categorysData[j].commodityIds.indexOf(_productItem[i].commodityId) > -1
								&& categorysData[j].commodityType == _productItem[i].commodityType
							){
								if(!_classifiedProducts.hasOwnProperty(categorysData[j].categoryId)){
									_classifiedProducts[categorysData[j].categoryId] = [];
								}
								_classifiedProducts[categorysData[j].categoryId].push(_productItem[i]);
							}
						}
					}
					// 排序
					for (const m in _classifiedProducts) {
						if (_classifiedProducts.hasOwnProperty(m)) {
							_classifiedProducts[m] = this.sortProducts(_classifiedProducts[m]);
						}
					}
					this.products = _productItem;
					this.productIds = _productIdItem;
					this.classifiedProducts = _classifiedProducts;
					return true;
				}
				return false;
			})
		);
	}
	*/


	/** 合约列表版本号 */
	// private proListVersion: any = 1;
	private queVersion:any = -1;
	/** 缓存合约数据 */
	cacheProducts(): Observable<boolean> {
		let self = this;
		// this.proListVersion = this.operatDB.db.version || 1;
		this.queVersion = localStorage.getItem('queVersion') || -1;
		// 获取
		const _url = 'api/v2/cfg/user/symbol1/query';
		const _data = { 
			"tradeMode": 0, 
			"queryMode": 1, 
			"i18nVersion": this.queVersion, 	// 多语言版本
			"version": this.queVersion
		};
		return this.http.post$(_url, _data).pipe(
			map(res => {
				if(res.code === '000000'){
					console.log('[查看返回的数据列表]', res);
					// 更新 indexedDB 版本
					// this.proListVersion = res.content.version;
					// window.indexedDB.open('productsDB', res.content.version);
					localStorage.setItem('queVersion', res.content.version);

					const sybolsData = this.changeSort(res.content.symbols);
					const categorysData = res.content.categorys;
					let _productItem: ProductIF[] = [];
					const _productIdItem = [];
					const _classifiedProducts = {};
					const _userName = JSON.parse(localStorage.getItem('userInfo')).loginName;	// 用户ID
					
					const _productItemCopy: ProductIF[] = [];


					if(this.queVersion == -1){
						// this.formateData(res);
						// 插入一二级排序 start
						const _cats: ProductCatIF[] = [];
						for(let i=0,r=categorysData.length; i<r; i++){
							if(categorysData[i].categoryLevel === 1 && categorysData[i].tradeMode === 0){
								const _item: ProductCatIF = categorysData[i];
								Object.assign(_item, {children: []});
								_cats.push(_item);
							}
						}
						for(let i=0,r=categorysData.length; i<r; i++){
							if(categorysData[i].categoryLevel === 2 && categorysData[i].tradeMode === 0){
								this.allChildcategory.push(categorysData[i]);
								for(let j = 0, k = _cats.length; j < k; j++){
									if(categorysData[i].parentCategoryId == _cats[j].categoryId){
										_cats[j].children.push(categorysData[i]);
									}
								}
							}
						}
						_cats.sort(this.compare('categorySort'));
						for (let i = 0, r = _cats.length; i < r; i++) {
							_cats[i].children.sort(this.compare('categorySort'));
						}
						this.updateCurrentCatId({
							parent: _cats[0].categoryId,
							child: _cats[0].children[0].categoryId,
							commodityType: _cats[0].children[0].commodityType
						});
						this.prodCats = categorysData;
						this.classifiedProdCats = _cats;
						// 插入一二级排序 end
						let proObj: ProductIF;
						for(let i=0,r=sybolsData.length; i<r; i++){
							let dicArr = sybolsData[i];
							if(dicArr.tradeMode.indexOf(0) > -1 && dicArr.contractVO.contractCode){	// 普通模式	
								proObj = {
									TOne: dicArr.marketVO.TOne,
									basic: false,
									buyRate: 0,
									categoryId: '',
									categoryIds: '',
									commodityCode: dicArr.commodityVO.commodityCode,
									commodityCurrency: dicArr.commodityVO.commodityCurrency,
									commodityId: dicArr.commodityVO.commodityId,
									commodityName: dicArr.commodityVO.commodityName,
									commoditySort: dicArr.commodityVO.commoditySort,
									commodityState: 0,
									commodityTrade: false,
									commodityType: dicArr.commodityVO.commodityType,
									considerationNum: dicArr.commodityVO.considerationNum,
									contractCode: dicArr.contractVO.contractCode,
									contractId: dicArr.contractVO.contractId,
									contractName: dicArr.commodityVO.commodityName,
									contractNum: dicArr.commodityVO.contractNum,
									contractSort: dicArr.contractVO.contractSort,
									contractState: 0,
									currency: 0,
									currencyCode: '',
									currencyGroupId: '',
									depositBalance: 0,
									depositCurrency: 0,
									depositHold: 0,
									depositNormal: dicArr.commodityVO.depositNormal,
									dueDate: 0,
									feeCurrency: 0,
									feeQuota: 0,
									feeType: 0,
									finalDate: 0,
									flowType: 0,
									interest: 0,
									interestCurrency: 0,
									lockFlag: false,
									marketCode: dicArr.marketVO.marketCode,
									marketId: dicArr.marketVO.marketId,
									marketName: dicArr.marketVO.marketName,
									marketSort: dicArr.marketVO.marketSort,
									marketState: 0,
									marketType: 0,
									minPriceDeno: 0,
									minPriceNume: 0, 
									month: 0,
									noticeDate: 0,
									orgCode: dicArr.marketVO.orgCode,
									orgId: dicArr.marketVO.orgId,
									priceGearsNum: dicArr.commodityVO.priceGearsNum,
									productId: dicArr.contractVO.contractId,
									sellRate: 0,
									taxRate: 0,
									tone: dicArr.marketVO.tone,
									tradeRate: 0,
									unionMinPrices: dicArr.commodityVO.unionMinPrices || 0,
									week: 0,
									year: 0,
									QLastPrice: 0,
									isChangeLastPrice: false,
									QAskPrice: 0,
									isChangeAskPrice: 1,
									QAskQty: 0,
									QBidPrice: 0,
									isBidPrice: 1,
									QBidQty: 0,
									QTotalQty: 0,
									QPositionQty: 0,
									QPreClosingPrice: 0, // 昨收
									QChangeValue: 0, // 涨跌
									QChangeRate: '0', // 涨幅
									QOpeningPrice: 0, // 开盘
									QHighPrice: 0, // 最高
									QLowPrice: 0, // 最低
									Stamp: 0, // 时间
									QSwing: 0, // 振幅
									commodityAbb: dicArr.commodityAbb,
									minOrderVol: dicArr.commodityVO.minOrderVol,
									depositNormalMode: dicArr.commodityVO.depositNormalMode,
									depositMode: dicArr.commodityVO.depositMode, 
									QTotalTurnover: 0,
									SignChangeRate: 0, 
									QTotalBidQty: 0,
									QTotalAskQty: 0,
									QInsideQty: 0,
									QOutsideQty: 0
								};
								_productItem.push(proObj);
								_productIdItem.push(dicArr.contractVO.contractId); // id 合集
								this.operatDB.add(proObj);
							}
						}	
						// 所有合约
						Window.getAllcontractList = _productItem;
						// 获取 _classifiedProducts 值
						for(let i=0,r=_productItem.length; i<r; i++){
							for(let j=0, r=categorysData.length; j<r; j++){
								if(categorysData[j].commodityIds.indexOf(_productItem[i].commodityId) > -1
									&& categorysData[j].commodityType == _productItem[i].commodityType){
									if(!_classifiedProducts.hasOwnProperty(categorysData[j].categoryId)){
										_classifiedProducts[categorysData[j].categoryId] = [];
									}
									_classifiedProducts[categorysData[j].categoryId].push(_productItem[i]);
								}
							}
						}
						// 排序
						for (const m in _classifiedProducts) {
							if (_classifiedProducts.hasOwnProperty(m)) {
								_classifiedProducts[m] = this.sortProducts(_classifiedProducts[m]);
							}
						}
						this.products = _productItem;
						this.productIds = _productIdItem;
						this.classifiedProducts = _classifiedProducts;



						return true;


					}else{
						// this.concatLocalData(res);
						let proObj: ProductIF;
						for(let i=0,r=sybolsData.length; i<r; i++){
							let dicArr = sybolsData[i];
							if(dicArr.tradeMode.indexOf(0) > -1 && dicArr.contractVO.contractCode){	// 普通模式	
								proObj = {
									TOne: dicArr.marketVO.TOne,
									basic: false,
									buyRate: 0,
									categoryId: '',
									categoryIds: '',
									commodityCode: dicArr.commodityVO.commodityCode,
									commodityCurrency: dicArr.commodityVO.commodityCurrency,
									commodityId: dicArr.commodityVO.commodityId,
									commodityName: dicArr.commodityVO.commodityName,
									commoditySort: dicArr.commodityVO.commoditySort,
									commodityState: 0,
									commodityTrade: false,
									commodityType: dicArr.commodityVO.commodityType,
									considerationNum: dicArr.commodityVO.considerationNum,
									contractCode: dicArr.contractVO.contractCode,
									contractId: dicArr.contractVO.contractId,
									contractName: dicArr.commodityVO.commodityName,
									contractNum: dicArr.commodityVO.contractNum,
									contractSort: dicArr.contractVO.contractSort,
									contractState: 0,
									currency: 0,
									currencyCode: '',
									currencyGroupId: '',
									depositBalance: 0,
									depositCurrency: 0,
									depositHold: 0,
									depositNormal: dicArr.commodityVO.depositNormal,
									dueDate: 0,
									feeCurrency: 0,
									feeQuota: 0,
									feeType: 0,
									finalDate: 0,
									flowType: 0,
									interest: 0,
									interestCurrency: 0,
									lockFlag: false,
									marketCode: dicArr.marketVO.marketCode,
									marketId: dicArr.marketVO.marketId,
									marketName: dicArr.marketVO.marketName,
									marketSort: dicArr.marketVO.marketSort,
									marketState: 0,
									marketType: 0,
									minPriceDeno: 0,
									minPriceNume: 0, 
									month: 0,
									noticeDate: 0,
									orgCode: dicArr.marketVO.orgCode,
									orgId: dicArr.marketVO.orgId,
									priceGearsNum: dicArr.commodityVO.priceGearsNum,
									productId: dicArr.contractVO.contractId,
									sellRate: 0,
									taxRate: 0,
									tone: dicArr.marketVO.tone,
									tradeRate: 0,
									unionMinPrices: dicArr.commodityVO.unionMinPrices || 0,
									week: 0,
									year: 0,
									QLastPrice: 0,
									isChangeLastPrice: false,
									QAskPrice: 0,
									isChangeAskPrice: 1,
									QAskQty: 0,
									QBidPrice: 0,
									isBidPrice: 1,
									QBidQty: 0,
									QTotalQty: 0,
									QPositionQty: 0,
									QPreClosingPrice: 0, // 昨收
									QChangeValue: 0, // 涨跌
									QChangeRate: '0', // 涨幅
									QOpeningPrice: 0, // 开盘
									QHighPrice: 0, // 最高
									QLowPrice: 0, // 最低
									Stamp: 0, // 时间
									QSwing: 0, // 振幅
									commodityAbb: dicArr.commodityAbb,
									minOrderVol: dicArr.commodityVO.minOrderVol,
									depositNormalMode: dicArr.commodityVO.depositNormalMode,
									depositMode: dicArr.commodityVO.depositMode, 
									QTotalTurnover: 0,
									SignChangeRate: 0, 
									QTotalBidQty: 0,
									QTotalAskQty: 0,
									QInsideQty: 0,
									QOutsideQty: 0
								};
								_productItemCopy.push(proObj);
								_productIdItem.push(dicArr.contractVO.contractId); // id 合集
							}
						}

						// proData: 本地缓存数据
						/*
						self.operatDB.getAllProduct(proData => {
							// _productItem = _productItemCopy.concat(proData);
							_productItem = proData;
							// 所有合约
							Window.getAllcontractList = _productItem;
							// 获取 _classifiedProducts 值
							for(let i=0,r=_productItem.length; i<r; i++){
								for(let j=0, r=categorysData.length; j<r; j++){
									if(categorysData[j].commodityIds.indexOf(_productItem[i].commodityId) > -1
										&& categorysData[j].commodityType == _productItem[i].commodityType){
										if(!_classifiedProducts.hasOwnProperty(categorysData[j].categoryId)){
											_classifiedProducts[categorysData[j].categoryId] = [];
										}
										_classifiedProducts[categorysData[j].categoryId].push(_productItem[i]);
									}
								}
							}
							// 排序
							for (const m in _classifiedProducts) {
								if (_classifiedProducts.hasOwnProperty(m)) {
									_classifiedProducts[m] = self.sortProducts(_classifiedProducts[m]);
								}
							}
							self.products = _productItem;
							self.productIds = _productIdItem;
							self.classifiedProducts = _classifiedProducts;
							for(let i=0,r=_productItemCopy.length; i<r; i++){ // inedxedDb 补全
								self.operatDB.add(_productItemCopy[i]);
							}
						});
						*/





						return true;



					}
					
				}
				return false;
			})
		);
	}

	formateData(res){
		const sybolsData = this.changeSort(res.content.symbols);
		const categorysData = res.content.categorys;
		const _productItem: ProductIF[] = [];
		const _productIdItem = [];
		const _classifiedProducts = {};
		const _userName = JSON.parse(localStorage.getItem('userInfo')).loginName;	// 用户ID
		// 插入一二级排序 start
		const _cats: ProductCatIF[] = [];
		for(let i=0,r=categorysData.length; i<r; i++){
			if(categorysData[i].categoryLevel === 1 && categorysData[i].tradeMode === 0){
				const _item: ProductCatIF = categorysData[i];
				Object.assign(_item, {children: []});
				_cats.push(_item);
			}
		}
		for(let i=0,r=categorysData.length; i<r; i++){
			if(categorysData[i].categoryLevel === 2 && categorysData[i].tradeMode === 0){
				this.allChildcategory.push(categorysData[i]);
				for(let j = 0, k = _cats.length; j < k; j++){
					if(categorysData[i].parentCategoryId == _cats[j].categoryId){
						_cats[j].children.push(categorysData[i]);
					}
				}
			}
		}
		_cats.sort(this.compare('categorySort'));
		for (let i = 0, r = _cats.length; i < r; i++) {
			_cats[i].children.sort(this.compare('categorySort'));
		}
		this.updateCurrentCatId({
			parent: _cats[0].categoryId,
			child: _cats[0].children[0].categoryId,
			commodityType: _cats[0].children[0].commodityType
		});
		this.prodCats = categorysData;
		this.classifiedProdCats = _cats;
		// 插入一二级排序 end
		let proObj: ProductIF;
		for(let i=0,r=sybolsData.length; i<r; i++){
			let dicArr = sybolsData[i];
			if(dicArr.tradeMode.indexOf(0) > -1 && dicArr.contractVO.contractCode){	// 普通模式	
				proObj = {
					TOne: dicArr.marketVO.TOne,
					basic: false,
					buyRate: 0,
					categoryId: '',
					categoryIds: '',
					commodityCode: dicArr.commodityVO.commodityCode,
					commodityCurrency: dicArr.commodityVO.commodityCurrency,
					commodityId: dicArr.commodityVO.commodityId,
					commodityName: dicArr.commodityVO.commodityName,
					commoditySort: dicArr.commodityVO.commoditySort,
					commodityState: 0,
					commodityTrade: false,
					commodityType: dicArr.commodityVO.commodityType,
					considerationNum: dicArr.commodityVO.considerationNum,
					contractCode: dicArr.contractVO.contractCode,
					contractId: dicArr.contractVO.contractId,
					contractName: dicArr.commodityVO.commodityName,
					contractNum: dicArr.commodityVO.contractNum,
					contractSort: dicArr.contractVO.contractSort,
					contractState: 0,
					currency: 0,
					currencyCode: '',
					currencyGroupId: '',
					depositBalance: 0,
					depositCurrency: 0,
					depositHold: 0,
					depositNormal: dicArr.commodityVO.depositNormal,
					dueDate: 0,
					feeCurrency: 0,
					feeQuota: 0,
					feeType: 0,
					finalDate: 0,
					flowType: 0,
					interest: 0,
					interestCurrency: 0,
					lockFlag: false,
					marketCode: dicArr.marketVO.marketCode,
					marketId: dicArr.marketVO.marketId,
					marketName: dicArr.marketVO.marketName,
					marketSort: dicArr.marketVO.marketSort,
					marketState: 0,
					marketType: 0,
					minPriceDeno: 0,
					minPriceNume: 0, 
					month: 0,
					noticeDate: 0,
					orgCode: dicArr.marketVO.orgCode,
					orgId: dicArr.marketVO.orgId,
					priceGearsNum: dicArr.commodityVO.priceGearsNum,
					productId: dicArr.contractVO.contractId,
					sellRate: 0,
					taxRate: 0,
					tone: dicArr.marketVO.tone,
					tradeRate: 0,
					unionMinPrices: dicArr.commodityVO.unionMinPrices || 0,
					week: 0,
					year: 0,
					QLastPrice: 0,
					isChangeLastPrice: false,
					QAskPrice: 0,
					isChangeAskPrice: 1,
					QAskQty: 0,
					QBidPrice: 0,
					isBidPrice: 1,
					QBidQty: 0,
					QTotalQty: 0,
					QPositionQty: 0,
					QPreClosingPrice: 0, // 昨收
					QChangeValue: 0, // 涨跌
					QChangeRate: '0', // 涨幅
					QOpeningPrice: 0, // 开盘
					QHighPrice: 0, // 最高
					QLowPrice: 0, // 最低
					Stamp: 0, // 时间
					QSwing: 0, // 振幅
					commodityAbb: dicArr.commodityAbb,
					minOrderVol: dicArr.commodityVO.minOrderVol,
					depositNormalMode: dicArr.commodityVO.depositNormalMode,
					depositMode: dicArr.commodityVO.depositMode, 
					QTotalTurnover: 0,
					SignChangeRate: 0, 
					QTotalBidQty: 0,
					QTotalAskQty: 0,
					QInsideQty: 0,
					QOutsideQty: 0
				};
				_productItem.push(proObj);
				_productIdItem.push(dicArr.contractVO.contractId); // id 合集
				this.operatDB.add(proObj);
			}
		}	
		// 所有合约
		Window.getAllcontractList = _productItem;
		// 获取 _classifiedProducts 值
		for(let i=0,r=_productItem.length; i<r; i++){
			for(let j=0, r=categorysData.length; j<r; j++){
				if(categorysData[j].commodityIds.indexOf(_productItem[i].commodityId) > -1
					&& categorysData[j].commodityType == _productItem[i].commodityType){
					if(!_classifiedProducts.hasOwnProperty(categorysData[j].categoryId)){
						_classifiedProducts[categorysData[j].categoryId] = [];
					}
					_classifiedProducts[categorysData[j].categoryId].push(_productItem[i]);
				}
			}
		}
		// 排序
		for (const m in _classifiedProducts) {
			if (_classifiedProducts.hasOwnProperty(m)) {
				_classifiedProducts[m] = this.sortProducts(_classifiedProducts[m]);
			}
		}
		this.products = _productItem;
		this.productIds = _productIdItem;
		this.classifiedProducts = _classifiedProducts;
	}

	concatLocalData(res){
		let self = this;
		const sybolsData = this.changeSort(res.content.symbols);
		const categorysData = res.content.categorys;
		let _productItem: ProductIF[] = [];
		let _productItemCopy: ProductIF[] = [];
		const _productIdItem = [];
		const _classifiedProducts = {};

		let proObj: ProductIF;
		for(let i=0,r=sybolsData.length; i<r; i++){
			let dicArr = sybolsData[i];
			if(dicArr.tradeMode.indexOf(0) > -1 && dicArr.contractVO.contractCode){	// 普通模式	
				proObj = {
					TOne: dicArr.marketVO.TOne,
					basic: false,
					buyRate: 0,
					categoryId: '',
					categoryIds: '',
					commodityCode: dicArr.commodityVO.commodityCode,
					commodityCurrency: dicArr.commodityVO.commodityCurrency,
					commodityId: dicArr.commodityVO.commodityId,
					commodityName: dicArr.commodityVO.commodityName,
					commoditySort: dicArr.commodityVO.commoditySort,
					commodityState: 0,
					commodityTrade: false,
					commodityType: dicArr.commodityVO.commodityType,
					considerationNum: dicArr.commodityVO.considerationNum,
					contractCode: dicArr.contractVO.contractCode,
					contractId: dicArr.contractVO.contractId,
					contractName: dicArr.commodityVO.commodityName,
					contractNum: dicArr.commodityVO.contractNum,
					contractSort: dicArr.contractVO.contractSort,
					contractState: 0,
					currency: 0,
					currencyCode: '',
					currencyGroupId: '',
					depositBalance: 0,
					depositCurrency: 0,
					depositHold: 0,
					depositNormal: dicArr.commodityVO.depositNormal,
					dueDate: 0,
					feeCurrency: 0,
					feeQuota: 0,
					feeType: 0,
					finalDate: 0,
					flowType: 0,
					interest: 0,
					interestCurrency: 0,
					lockFlag: false,
					marketCode: dicArr.marketVO.marketCode,
					marketId: dicArr.marketVO.marketId,
					marketName: dicArr.marketVO.marketName,
					marketSort: dicArr.marketVO.marketSort,
					marketState: 0,
					marketType: 0,
					minPriceDeno: 0,
					minPriceNume: 0, 
					month: 0,
					noticeDate: 0,
					orgCode: dicArr.marketVO.orgCode,
					orgId: dicArr.marketVO.orgId,
					priceGearsNum: dicArr.commodityVO.priceGearsNum,
					productId: dicArr.contractVO.contractId,
					sellRate: 0,
					taxRate: 0,
					tone: dicArr.marketVO.tone,
					tradeRate: 0,
					unionMinPrices: dicArr.commodityVO.unionMinPrices || 0,
					week: 0,
					year: 0,
					QLastPrice: 0,
					isChangeLastPrice: false,
					QAskPrice: 0,
					isChangeAskPrice: 1,
					QAskQty: 0,
					QBidPrice: 0,
					isBidPrice: 1,
					QBidQty: 0,
					QTotalQty: 0,
					QPositionQty: 0,
					QPreClosingPrice: 0, // 昨收
					QChangeValue: 0, // 涨跌
					QChangeRate: '0', // 涨幅
					QOpeningPrice: 0, // 开盘
					QHighPrice: 0, // 最高
					QLowPrice: 0, // 最低
					Stamp: 0, // 时间
					QSwing: 0, // 振幅
					commodityAbb: dicArr.commodityAbb,
					minOrderVol: dicArr.commodityVO.minOrderVol,
					depositNormalMode: dicArr.commodityVO.depositNormalMode,
					depositMode: dicArr.commodityVO.depositMode, 
					QTotalTurnover: 0,
					SignChangeRate: 0, 
					QTotalBidQty: 0,
					QTotalAskQty: 0,
					QInsideQty: 0,
					QOutsideQty: 0
				};
				_productItemCopy.push(proObj);
				_productIdItem.push(dicArr.contractVO.contractId); // id 合集
			}
		}

		// proData: 本地缓存数据
		self.operatDB.getAllProduct(proData => {
			_productItem = _productItemCopy.concat(proData);
			// 所有合约
			Window.getAllcontractList = _productItem;
			// 获取 _classifiedProducts 值
			for(let i=0,r=_productItem.length; i<r; i++){
				for(let j=0, r=categorysData.length; j<r; j++){
					if(categorysData[j].commodityIds.indexOf(_productItem[i].commodityId) > -1
						&& categorysData[j].commodityType == _productItem[i].commodityType){
						if(!_classifiedProducts.hasOwnProperty(categorysData[j].categoryId)){
							_classifiedProducts[categorysData[j].categoryId] = [];
						}
						_classifiedProducts[categorysData[j].categoryId].push(_productItem[i]);
					}
				}
			}
			// 排序
			for (const m in _classifiedProducts) {
				if (_classifiedProducts.hasOwnProperty(m)) {
					_classifiedProducts[m] = self.sortProducts(_classifiedProducts[m]);
				}
			}
			
			for(let i=0,r=_productItemCopy.length; i<r; i++){ // inedxedDb 补全
				self.operatDB.add(_productItemCopy[i]);
				_productIdItem.push(_productItemCopy[i].contractId);
			}

			self.products = _productItem;
			self.productIds = _productIdItem;
			self.classifiedProducts = _classifiedProducts;
		});
	}
	


	/**
	 * 合约排序
	 * 市场 > 品种 > 合约
	 * marketSort > commoditySort > contractSort
	 */
	private sortProducts(prods: ProductIF[]): ProductIF[] {
		const _list = prods.sort((a, b) => {
			if (a.marketSort === b.marketSort) {
				if (a.commoditySort === b.commoditySort) {
					return a.contractSort - b.contractSort;
				}
				return a.commoditySort - b.commoditySort;
			}
			return a.marketSort - b.marketSort;
		});
		return _list;
	}

	/**
	 * 获取指定分类下的所有合约
	 */
	getProductsByCatId(catId?: string): ProductIF[] {
		console.log('s1', this.products);
		if (!this.classifiedProducts) {
			this.translate.get('没有缓存的合约列表').subscribe((res: string) => {
				this.toastr.error(res);
			});
			return;
		}
		if (catId) {
			console.log('s3', this.classifiedProducts[catId], catId);
			return this.classifiedProducts[catId];
		}
		return this.products;
	}

	/**
	 * 通过合约 id 获取合约信息
	 */
	getProductByProdId(prodId: string): ProductIF | null {
		const _index = this.findProdIndex(prodId, this.products);
		if (_index > -1) {
			return this.products[_index];
		} else {
			return null;
		}
	}

	/**
	 * 通过分类 id 获取分类信息
	 */
	getCatByCatId(catId: string): ProductCatIF | null {
		const _index = this.findCatIndex(catId, this.prodCats);
		if (_index > -1) {
			return this.prodCats[_index];
		} else {
			return null;
		}
	}

	/**
	 * 订阅行情推送
	 * @param prodIds - 需要订阅的合约的 id 列表
	 */
	subscribeProductsPrice(prodIds: string[]) {
		this.socket.addProdsPrice(prodIds);
	}

	subscribeProductsPriceDelay(prodIds: string[]) {
		this.socket.addProdsPriceDelay(prodIds);
	}

	/**
	 * 退订行情
	 * @param prodIds - 不传则退订所有的合约行情
	 */
	unsubscribeProductsPrice(prodIds?: string[]) {
		this.socket.removeProdsPrice(prodIds ? prodIds : this.productIds);
	}

	unsubscribeProductsPriceDelay(prodIds?: string[]) {
		this.socket.removeProdsPriceDelay(prodIds ? prodIds : this.productIds);
	}

	/**
	 * 获取订阅的行情推送
	 */
	getProductsPrice(): Observable<ProductPriceIF> {
		return this.socket.getProdPrice().pipe(
			map((res: string) => {
				// console.log('[socket - 行情推送]', this.transProductsPrice(res));
				return this.transProductsPrice(res);
			})
		);
	}

	/**
	 * 获取订阅的行情推送 (延迟)
	 */
	getProductsPriceDelay(): Observable<ProductPriceDelayIF> {
		return this.socket.getProdPriceDelay().pipe(
			map((res: string) => {
				// console.log('[socket - 行情推送]', this.transProductsPriceDelay(res));
				return this.transProductsPriceDelay(res);
			})
		);
	}
	/**
	 * 转化行情信息
	 */
	private transProductsPrice(str: string): ProductPriceIF {
		const _arr = str.split('|');
		// console.log('行情推送', _arr);
		const _QBidPrice = _arr[16].split(',');
		const _QAskPrice = _arr[18].split(',');

		return {
			ProductId: _arr[0],
			ProductName: _arr[1],
			ProductArray: _arr[2].split(','),
			OrgId: _arr[3],
			OrgCode: _arr[4],
			InterMarketNo: _arr[5],
			InterCommodityNo: _arr[6],
			InterContractNo: _arr[7],
			QuoteProtocolNo: _arr[8],
			QuoteSymbolNo: _arr[9],
			CurrencySymbol: _arr[10],
			DateTimeStamp: _arr[11],
			Stamp: +_arr[12],
			DayLineStamp: +_arr[13],
			QLastPrice: +_arr[14],
			QLastQty: +_arr[15],
			QBidPrice: _QBidPrice,
			QBidQty: _arr[17].split(','),
			QAskPrice: _QAskPrice,
			QAskQty: _arr[19].split(','),
			TradingState: _arr[20],
			QPreClosingPrice: +_arr[21],
			QPreSettlePrice: +_arr[22],
			QPrePositionQty: +_arr[23],
			QOpeningPrice: +_arr[24],
			QHighPrice: +_arr[25],
			QLowPrice: +_arr[26],
			QClosingPrice: +_arr[27],
			QSettlePrice: +_arr[28],
			QLimitUpPrice: +_arr[29],
			QLimitDownPrice: +_arr[30],
			QTotalQty: +_arr[31],
			QTotalTurnover: +_arr[32],
			QPositionQty: +_arr[33],
			QAveragePrice: +_arr[34],
			QInsideQty: +_arr[35],
			QOutsideQty: +_arr[36],
			QChangeSpeed: +_arr[37],
			QChangeRate: +_arr[38],
			QChangeValue: +_arr[39],
			QSwing: +_arr[40],
			QTotalBidQty: +_arr[41],
			QTotalAskQty: +_arr[42],
			Volume: +_arr[43],
			Turnover: +_arr[44],
			AveragePrice: +_arr[45],
			SignType: +_arr[46],
			SignStamp: +_arr[47],
			SignPriceOpen: +_arr[48],
			SignPriceMax: +_arr[49],
			SignPriceMin: +_arr[50],
			SignPriceClose: +_arr[51],
			SignRecvCnt: +_arr[52],
			SignPriceAvg: +_arr[53],
			SignChangeValue: +_arr[54],
			SignChangeRate: +_arr[55],
			SignQty: +_arr[56],
			SignTurnover: +_arr[57],
			IsRag: +_arr[58],
			AskPriceOpen: +_arr[59],
			AskPriceMax: +_arr[60],
			AskPriceMin: +_arr[61],
			AskPriceClose: +_arr[62],
			BidPriceOpen: +_arr[63],
			BidPriceMax: +_arr[64],
			BidPriceMin: +_arr[65],
			BidPriceClose: +_arr[66],
		};
	}
	private transProductsPriceDelay(_arr: any): ProductPriceDelayIF {
		return {
			ProductId: _arr[0],
			DateTimeStamp: _arr[1],
			QLastPrice: _arr[2],
			QLastQty: _arr[3],
			QBidPrice: _arr[4],
			QBidQty: _arr[5],
			QAskPrice: _arr[6],
			QAskQty: _arr[7],
			QPreClosingPrice: _arr[8],
			QPreSettlePrice: _arr[9],
			QPrePositionQty: _arr[10],
			QOpeningPrice: _arr[11],
			QHighPrice: _arr[12],
			QLowPrice: _arr[13],
			QClosingPrice: _arr[14],
			QSettlePrice: _arr[15],
			QLimitUpPrice: _arr[16],
			QLimitDownPrice: _arr[17],
			QTotalQty: _arr[18],
			QTotalTurnover: _arr[19],
			QPositionQty: _arr[20],
			QAveragePrice: _arr[21],
			QChangeRate: _arr[22],
			QChangeValue: _arr[23],
			QTotalBidQty: _arr[24],
			QTotalAskQty: _arr[25],
			Volume: _arr[26],
			Turnover: _arr[27],
			AveragePrice: _arr[28],
			SignType: _arr[29],
			SignStamp: _arr[30],
			SignPriceOpen: _arr[31],
			SignPriceMax: _arr[32],
			SignPriceMin: _arr[33],
			SignPriceClose: _arr[34],
			SignRecvCnt: _arr[35],
			SignPriceAvg: _arr[36],
			SignChangeValue: _arr[37],
			SignChangeRate: _arr[38],
			SignQty: _arr[39],
			AskPriceOpen: _arr[40],
			AskPriceMax: _arr[41],
			AskPriceMin: _arr[42],
			AskPriceClose: _arr[43],
			BidPriceOpen: _arr[44],
			BidPriceMax: _arr[45],
			BidPriceMin: _arr[46],
			BidPriceClose: _arr[47],
			Stamp: _arr[48],
			DayLineStamp: _arr[49],
		};
	}
	/**
	 * 计算行情数值
	 */
	calcProductsPrice(prods: ProductIF[], price: any): ProductIF[] {
		for (let i = 0, l = prods.length; i < l; i++) {
			for (let j = 0, k = price.ProductArray.length; j < k; j++) {
				if (prods[i].productId === price.ProductArray[j]) {
					/* 价格变更效果 */
					// if (prods[i].QLastPrice !== price.QLastPrice) {
					// 	prods[i].isChangeLastPrice = (prods[i].isChangeLastPrice === 1) ? 2 : 1;
					// }
					prods[i].isChangeLastPrice = (prods[i].QLastPrice !== price.QLastPrice) ? true : false;
					if (prods[i].QAskPrice !== price.QAskPrice[0]) {
						prods[i].isChangeAskPrice = (prods[i].isChangeAskPrice === 1) ? 2 : 1;
					}
					// if (prods[i].QBidPrice !== price.QBidPrice[0]) {
					// 	prods[i].isChangeBidPrice = (prods[i].isChangeBidPrice === 1) ? 2 : 1;
					// }
					prods[i].isChangeBidPrice = (prods[i].QBidPrice !== price.QBidPrice[0]) ? true : false;

					prods[i].QLastPrice = price.QLastPrice;
					prods[i].QAskPrice = price.QAskPrice[0];
					prods[i].QAskQty = price.QAskQty;
					prods[i].QBidPrice = price.QBidPrice[0];
					prods[i].QBidQty = price.QBidQty;
					prods[i].QTotalQty = price.QTotalQty;
					prods[i].QPositionQty = price.QPositionQty;
					prods[i].QPreClosingPrice = price.QPreClosingPrice;
					prods[i].QChangeValue = price.QChangeValue;
					prods[i].QChangeRate = price.QChangeRate;
					prods[i].QOpeningPrice = price.QOpeningPrice;
					prods[i].QHighPrice = price.QHighPrice;
					prods[i].QLowPrice = price.QLowPrice;
					prods[i].Stamp = price.Stamp * 1000;
					prods[i].QSwing = price.QSwing;
					let _CFD:any = math.subtract(
						math.bignumber(prods[i].QBidPrice),
						math.bignumber(prods[i].QAskPrice)
					);
					prods[i].CFD = _CFD/prods[i].unionMinPrices*Window.floatChangeInt(prods[i].unionMinPrices);
				}

				if (j === price.ProductArray.length - 1) {
					break;
				}
			}
		}

		return prods;
	}

	calcProductsPriceDelay(prods: ProductIF[], price: any): ProductIF[] {
		prods.forEach(x=> {
			x.isChangeLastPrice = false;
			x.isChangeBidPrice = false;
		});
		for (let i = 0, l = prods.length; i < l; i++) {
			if (prods[i].productId === price.ProductId) {
				/* 价格变更效果 */
				// if (prods[i].QLastPrice !== price.QLastPrice) {
				// 	prods[i].isChangeLastPrice = (prods[i].isChangeLastPrice === 1) ? 2 : 1;
				// }
				prods[i].isChangeLastPrice = (prods[i].QLastPrice !== price.QLastPrice) ? true : false;

				if (prods[i].QAskPrice !== price.QAskPrice[0]) {
					prods[i].isChangeAskPrice = (prods[i].isChangeAskPrice === 1) ? 2 : 1;
				}
				// if (prods[i].QBidPrice !== price.QBidPrice[0]) {
				// 	prods[i].isChangeBidPrice = (prods[i].isChangeBidPrice === 1) ? 2 : 1;
				// }
				prods[i].isChangeBidPrice = (prods[i].QBidPrice !== price.QBidPrice[0]) ? true : false;

				prods[i].QLastPrice = price.QLastPrice;
				prods[i].QAskPrice = price.QAskPrice[0];
				prods[i].QAskQty = price.QAskQty;
				prods[i].QBidPrice = price.QBidPrice[0];
				prods[i].QBidQty = price.QBidQty;
				prods[i].QTotalQty = price.QTotalQty;
				prods[i].QPositionQty = price.QPositionQty;
				prods[i].QPreClosingPrice = price.QPreClosingPrice;
				prods[i].QChangeValue = price.QChangeValue;
				prods[i].QChangeRate = price.QChangeRate;
				prods[i].QOpeningPrice = price.QOpeningPrice;
				prods[i].QHighPrice = price.QHighPrice;
				prods[i].QLowPrice = price.QLowPrice;
				prods[i].Stamp = price.Stamp * 1000;
				prods[i].QSwing = price.QSwing || 0;
				let _CFD:any = math.subtract(
					math.bignumber(prods[i].QBidPrice),
					math.bignumber(prods[i].QAskPrice)
				);
				prods[i].CFD = _CFD/prods[i].unionMinPrices*Window.floatChangeInt(prods[i].unionMinPrices);
				break;
			}
		}

		return prods;
	}

	/**
	 * 查询指定合约历史交易明细
	 */
	getProdTradDetail(data: GetProdTradeDetailReqIF): Observable<TradeDetailInfoIF[] | null> {
		const _url = 'trade/price/cur/quote/detail/qry';
		return this.http.post$(_url, data).pipe(
			map(res => {
				if (res.code === '000000' && res.list) {
					const _list: TradeDetailInfoIF[] = [];
					for (let i = 0, l = res.list.length; i < l; i ++) {
						const _origin: GetProdTradeDetailResIF = JSON.parse(res.list[i]);
						const _item: TradeDetailInfoIF = {
							time: _origin.DataTimeStamp.split(' ')[1],
							QLastPrice: _origin.QLastPrice,
							QLastQty: _origin.QLastQty
						};
						_list.push(_item);
					}
					// console.log('交易明细', _list);
					return _list;
				} else {
					return null;
				}
			})
		);
	}
		/**
	 * 分类排序函数
	 */
	compare(property){
		return function(a, b){
			let value1 = a[property];
			let value2 = b[property];
			return value1 - value2;
		}
	}




	/**
	 * 
	 * 	初始化获取indexedDB
	 * 
	 */
	initIndexedDB (){
		let self = this;
		// let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
		let indexedDB = window.indexedDB;
		if(!indexedDB){
			console.log("你的浏览器不支持IndexedDB");
		}
		let open = indexedDB.open('productsDB', 1);
		open.onupgradeneeded = function(e){
			console.log('触发了 upgradeneeded 事件')
			// let db = e.target.result;
			let db = e.target['result'];
			if (!db.objectStoreNames.contains('Product')) {
				console.log('创建新的对象存储')
				let person = db.createObjectStore('Product',{keyPath: 'productId'});
				person.createIndex('productId', 'productId', {unique: true});
				person.createIndex('commodityName', 'commodityName', {unique: false});
			}
		}
		open.onsuccess = function(e){
			console.log('触发了 success 事件');
			// let db = e.target.result;
			let db = e.target['result'];
			// 实例化数据库操作对象
			self.operatDB = new OperatDB(db);
			// Window.operatDB  用来调试
			Window.operatDB = self.operatDB;
		}
		open.onerror = function(e){
			console.log('触发了 error 事件')
			console.log(e)
		}
	}
}
