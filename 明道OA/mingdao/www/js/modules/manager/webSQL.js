define(function(require, exports, module) {
	var dataBaseVersion = "1.0";
	var dataBase = false;
	var dataBaseName, dataBaseDesc, dataBaseSize
	exports.init = function(dataBaseName, dataBaseDesc, dataBaseSize) {
		dataBase = openDatabase(dataBaseName, dataBaseVersion, dataBaseDesc, dataBaseSize, function() {
		});
	};
	exports.connect=function(){
		if (!dataBase) {
			exports.init('MD_OA','MD_OA',1024*1024*5);
		}
	};
	exports.isSupport = function() {
		if (dataBase) {
			return true;
		} else {
			return false;
		}
	};
	exports.createTable = function(sql, successCallback, errorCallback) {
		if (exports.isSupport()) {
			dataBase.transaction(function(tx) {
				tx.executeSql(sql, [], function(tx, result) {
					if ( typeof successCallback == 'function') {
						successCallback();
					}
				}, function(tx, error) {
					if ( typeof errorCallback == 'function') {
						errorCallback(error.message);
					}
				});
			});
		}
	};
	exports.insert  = function(sql,params, successCallback, errorCallback) {
		if (exports.isSupport()) {
			dataBase.transaction(function(tx) {
				tx.executeSql(sql, params, function(tx, result) {
					if ( typeof successCallback == 'function') {
						successCallback();
					}
				}, function(tx, error) {
					if ( typeof errorCallback == 'function') {
						errorCallback(error.message);
					}
				});
			});
		}
	};
	exports.query  = function(sql,params, successCallback, errorCallback) {
		if (exports.isSupport()) {
			dataBase.transaction(function(tx) {
				tx.executeSql(sql, params, function(tx, result) {
					if ( typeof successCallback == 'function') {
						successCallback(result);
					}
				}, function(tx, error) {
					if ( typeof errorCallback == 'function') {
						errorCallback(error.message);
					}
				});
			});
		}
	};
	exports.update  = function(sql,params, successCallback, errorCallback) {
		if (exports.isSupport()) {
			dataBase.transaction(function(tx) {
				tx.executeSql(sql, params, function(tx, result) {
					if ( typeof successCallback == 'function') {
						successCallback(result);
					}
				}, function(tx, error) {
					if ( typeof errorCallback == 'function') {
						errorCallback(error.message);
					}
				});
			});
		}
	};
	exports.del  = function(sql,params, successCallback, errorCallback) {
		if (exports.isSupport()) {
			dataBase.transaction(function(tx) {
				tx.executeSql(sql, params, function(tx, result) {
					if ( typeof successCallback == 'function') {
						successCallback();
					}
				}, function(tx, error) {
					if ( typeof errorCallback == 'function') {
						errorCallback(error.message);
					}
				});
			});
		}
	};
	exports.dropTable  = function(sql,successCallback, errorCallback) {
		if (exports.isSupport()) {
			dataBase.transaction(function(tx) {
				tx.executeSql(sql, [], function(tx, result) {
					
					if ( typeof successCallback == 'function') {
						successCallback();
					}
				}, function(tx, error) {
					if ( typeof errorCallback == 'function') {
						errorCallback(error.message);
					}
				});
			});
		}
	};
	 
});
