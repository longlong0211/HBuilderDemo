define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $webSQLManager = require('manager/webSQL');
	loadUser = function(callback, i, c) {
		if (i == c) {
			$webSQLManager.query('SELECT  USER_ID, NAME,DEPT,JOB,EMAIL,KEYWORD,PIC  FROM  MD_CONTACTS ORDER BY KEYWORD,NAME', [], function(dbResult) {
				if (dbResult) {
					if (typeof callback == 'function') {
						callback(dbResult);
					}
				}
			}, function(msg) {
				alert(msg);
			});
		}
	};
	loadDept = function(callback, i, c) {
		if (i == c) {
			$webSQLManager.query('SELECT  ID,NAME  FROM  MD_DEPT ORDER BY NAME', [], function(dbResult) {
				if (dbResult) {
					if (typeof callback == 'function') {
						callback(dbResult);
					}
				}
			}, function(msg) {
				alert(msg);
			});
		}
	};
	loadProvince = function(callback, i, c) {
		if (i == c) {
			$webSQLManager.query('SELECT  ID,NAME  FROM  MD_PROVINCE ORDER BY DISPLAY_ORDER', [], function(dbResult) {
				if (dbResult) {
					if (typeof callback == 'function') {
						callback(dbResult);
					}
				}
			}, function(msg) {
				alert(msg);
			});
		}
	};
	loadCity = function(provinceId, callback, i, c) {
		if (i == c) {
			$webSQLManager.query('SELECT  ID,NAME  FROM  MD_CITY WHERE PROVINCE_ID = ? ORDER BY DISPLAY_ORDER', [provinceId], function(dbResult) {
				if (dbResult) {
					if (typeof callback == 'function') {
						callback(dbResult);
					}
				}
			}, function(msg) {
				alert(msg);
			});
		}
	};
	exports.loadMyApply = function(callback) {
		var requestURL = $common.getRestApiURL() + '/wf/apply/my';
		if (requestURL) {
			requestURL = encodeURI(requestURL);
			$.ajax({
				type: 'POST',
				url: requestURL,
				dataType: 'json',
				data: {
					'laToken': $userInfo.get('laAccessToken')
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							var applyList = jsonData['applyList'];
							if (applyList) {
								if (typeof callback == 'function') {
									callback(JSON.stringify(applyList));
								}
							}
						}
					}
				},
				error: function(jsonData) {}
			});
		}
	};
	exports.refreshDept = function(callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.del('delete from MD_DEPT', [], function() {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/common/common/deptAll',
					dataType: 'json',
					data: {
						'oaToken': $userInfo.get('token')
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								var deptList = jsonData['deptList'];
								if (deptList) {
									var deptSize = $(deptList).size();
									var _index = 0;
									var companyId = $userInfo.get('companyId');
									$(deptList).each(function(i, dept) {
										$webSQLManager.insert('insert  into  MD_DEPT (COMPANY_ID,ID, NAME) values(?, ?,?)', [companyId, dept['name'], dept['name']], function() {
											_index += 1;
											loadDept(callback, _index, deptSize);
										}, function(msg) {
											alert('e' + msg);
										});
									});
								}
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {}
				});
			}, function(msg) {
				alert('d' + msg);
			});
		}
	};
	exports.getDeptList = function(companyId,callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.createTable('create table if not exists MD_DEPT (COMPANY_ID TEXT,ID TEXT,NAME TEXT)', function() {
				$webSQLManager.query('SELECT COUNT(*) T FROM MD_DEPT where COMPANY_ID=?', [companyId], function(dbResult) {
					if (dbResult) {
						var resultRows = dbResult.rows.length;
						var count = dbResult.rows.item(0)['T'];
						count = parseInt(count);
						if (count == 0) {
							exports.refreshDept(callback);
						} else {
							$webSQLManager.query('SELECT DISTINCT(COMPANY_ID) COMPANY_ID  FROM MD_DEPT', [], function(distinctResult) {
								var resultRows = distinctResult.rows.length;
								var distinctFalg = false;
								if (resultRows == 1) {
									var cid = distinctResult.rows.item(0)['COMPANY_ID'];
									if (cid) {
										if (cid != $userInfo.get('companyId')) {
											distinctFalg = true;
										}
									}
								} else if (resultRows > 1) {
									distinctFalg = true;
								}
								if (distinctFalg) {
									exports.refreshDept(callback);
								} else {
									loadDept(callback, 1, 1);
								}
							}, function(msg) {
								alert('c' + msg);
							});
						}
					}
				}, function(msg) {
					alert('b' + msg);
				});
			}, function(msg) {
				alert('a' + msg);
			});
		}
	};
	exports.refreshProvinceList = function(callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.del('delete from MD_PROVINCE', [], function() {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/common/common/provinceList',
					dataType: 'json',
					data: {
						'laToken': $userInfo.get('laAccessToken')
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								var provinceList = jsonData['provinceList'];
								if (provinceList) {

									var provinceSize = $(provinceList).size();
									var _index = 0;
									$(provinceList).each(function(i, province) {
										$webSQLManager.insert('insert  into  MD_PROVINCE (ID, NAME,DISPLAY_ORDER) values(?, ?,?)', [province['id'], province['name'], province['dsplayOrder']], function() {
											_index += 1;
											loadProvince(callback, _index, provinceSize);
										}, function(msg) {
											alert(msg);
										});
									});
								}
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {}
				});
			}, function(msg) {
				alert(msg);
			});
		}
	};
	exports.refreshCityList = function(provinceId, callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.del('delete from MD_CITY WHERE PROVINCE_ID=?', [provinceId], function() {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/common/common/cityList',
					dataType: 'json',
					data: {
						'laToken': $userInfo.get('laAccessToken'),
						'provinceId': provinceId
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								var cityList = jsonData['cityList'];
								if (cityList) {
									var citySize = $(cityList).size();
									var _index = 0;
									$(cityList).each(function(i, city) {
										$webSQLManager.insert('insert  into  MD_CITY (ID, NAME,PROVINCE_ID,DISPLAY_ORDER) values(?,?,?,?)', [city['id'], city['name'], provinceId, city['dsplayOrder']], function() {
											_index += 1;
											loadCity(provinceId, callback, _index, citySize);
										}, function(msg) {
											alert(msg);
										});
									});
								}
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {}
				});
			}, function(msg) {
				alert(msg);
			});
		}
	};
	exports.getProvinceList = function(callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.createTable('create table if not exists MD_PROVINCE (ID INTEGER, NAME TEXT,DISPLAY_ORDER INTEGER)', function() {
				$webSQLManager.query('SELECT COUNT(*) T FROM MD_PROVINCE', [], function(dbResult) {
					if (dbResult) {
						var resultRows = dbResult.rows.length;
						var count = dbResult.rows.item(0)['T'];
						count = parseInt(count);
						if (count == 0) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/common/common/provinceList',
								dataType: 'json',
								data: {
									'oaToken': $userInfo.get('token')
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											var provinceList = jsonData['provinceList'];
											if (provinceList&&$(provinceList).size()>0) {
												var provinceSize = $(provinceList).size();
												var _index = 0;
												$(provinceList).each(function(i, province) {
													$webSQLManager.insert('insert  into  MD_PROVINCE (ID, NAME,DISPLAY_ORDER) values(?, ?,?)', [province['id'], province['name'], province['dsplayOrder']], function() {
														_index += 1;
														loadProvince(callback, _index, provinceSize);
													}, function(msg) {
														alert(msg);
													});
												});
											}
										}
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {}
							});
						} else {
							loadProvince(callback, 1, 1);
						}
					}
				}, function(msg) {
					alert(msg);
				});
			}, function(msg) {
				alert(msg);
			});
		}
	};

	exports.getCityList = function(provinceId, callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.createTable('create table if not exists MD_CITY (ID INTEGER, NAME TEXT,PROVINCE_ID INTEGER,DISPLAY_ORDER INTEGER)', function() {
				$webSQLManager.query('SELECT COUNT(*) T FROM MD_CITY WHERE PROVINCE_ID =?', [provinceId], function(dbResult) {
					if (dbResult) {
						var resultRows = dbResult.rows.length;
						var count = dbResult.rows.item(0)['T'];
						count = parseInt(count);
						if (count == 0) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/common/common/cityList',
								dataType: 'json',
								data: {
									'oaToken': $userInfo.get('token'),
									'id': provinceId
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											var cityList = jsonData['cityList'];
											if (cityList) {
												var citySize = $(cityList).size();
												var _index = 0;
												$(cityList).each(function(i, city) {
													$webSQLManager.insert('insert  into  MD_CITY (ID, NAME,PROVINCE_ID,DISPLAY_ORDER) values(?,?,?,?)', [city['id'], city['name'], provinceId, city['dsplayOrder']], function() {
														_index += 1;
														loadCity(provinceId, callback, _index, citySize);
													}, function(msg) {
														alert(msg);
													});
												});
											}
										}
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {}
							});
						} else {
							loadCity(provinceId, callback, 1, 1);
						}
					}
				}, function(msg) {
					alert(msg);
				});
			}, function(msg) {
				alert(msg);
			});
		}
	};
	exports.searchContacts = function(searchKey, callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.query("SELECT  USER_ID, NAME,DEPT,JOB,EMAIL,KEYWORD,PIC  FROM  MD_CONTACTS WHERE NAME LIKE ? ORDER BY KEYWORD,NAME", ['%' + searchKey + '%'], function(dbResult) {
				if (dbResult) {
					if (typeof callback == 'function') {
						callback(dbResult);
					}
				}
			}, function(msg) {
				alert(msg);
			});
		}
	};
	exports.refreshContacts = function(callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.del('delete from MD_CONTACTS', [], function() {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/common/common/userAll',
					dataType: 'json',
					data: {
						'laToken': $userInfo.get('laAccessToken')
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								var userList = jsonData['userList'];
								if (userList) {
									var userSize = $(userList).size();
									var _index = 0;
									var companyId = $userInfo.get('companyId');
									$(userList).each(function(i, user) {
										$webSQLManager.insert('insert  into  MD_CONTACTS (COMPANY_ID,USER_ID, NAME,DEPT,JOB,EMAIL,KEYWORD,PIC) values(?,?, ?,?,?,?,?,?)', [companyId, user['userId'], user['name'], user['dept'], user['job'], user['email'], user['keyWord'], user['avstar100']], function() {
											_index += 1;
											loadUser(callback, _index, userSize);
										}, function(msg) {
											alert(msg);
										});
									});
								}
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {}
				});
			}, function(msg) {
				alert('d' + msg);
			});
		}
	};
	exports.getContactsList = function(callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.createTable('create table if not exists MD_CONTACTS (COMPANY_ID TEXT,USER_ID TEXT, NAME TEXT,DEPT TEXT,JOB TEXT,EMAIL TEXT, KEYWORD TEXT,PIC TEXT)', function() {
				$webSQLManager.query('SELECT COUNT(*) T FROM MD_CONTACTS', [], function(dbResult) {
					if (dbResult) {
						var resultRows = dbResult.rows.length;
						var count = dbResult.rows.item(0)['T'];
						count = parseInt(count);
						if (count == 0) {
							exports.refreshContacts(callback);
						} else {
							$webSQLManager.query('SELECT DISTINCT(COMPANY_ID) COMPANY_ID  FROM MD_CONTACTS', [], function(distinctResult) {
								var resultRows = distinctResult.rows.length;
								var distinctFalg = false;
								if (resultRows == 1) {
									var cid = distinctResult.rows.item(0)['COMPANY_ID'];
									if (cid) {
										if (cid != $userInfo.get('companyId')) {
											distinctFalg = true;
										}
									}
								} else if (resultRows > 1) {
									distinctFalg = true;
								}
								if (distinctFalg) {
									exports.refreshContacts(callback);
								} else {
									loadUser(callback, 1, 1);
								}
							}, function(msg) {
								alert('c' + msg);
							});
						}
					}
				}, function(msg) {
					alert(msg);
				});
			}, function(msg) {
				alert(msg);
			});
		}
	};
});