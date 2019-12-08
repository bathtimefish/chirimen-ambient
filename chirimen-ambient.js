/*
 * Chrimen Ambient
 * 
 * Send/Read sensor data to Ambient for the demo of Chirimen.
 * 
 * Author: BathTimeFish
 * Created at: 2019/12/8
 */

function ChirimenAmbient() {
  this.corsany = 'https://cors-anywhere.herokuapp.com/';  // force over the CORS. it's bad practice..
  this.hostname = 'http://54.65.206.59';
  this.channel_id = null;
  this.read_key = null;
  this.write_key = null;
}

ChirimenAmbient.prototype.channel = function(channel_id, read_key, write_key) {
  if(!channel_id) throw new Error('Channel ID is empty');
  if(!read_key) throw new Error('Read Key is empty');
  if(!write_key) throw new Error('Write Key is empty');
  this.channel_id = channel_id;
  this.read_key = read_key;
  this.write_key = write_key;
};

ChirimenAmbient.prototype.send = function(data) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var d = (data instanceof Array) ? data : [data];
    options = {
      method: 'post',
      url: self.corsany + self.hostname + '/api/v2/channels/' + self.channel_id + '/dataarray',
      headers: {'Content-Type': 'application/json'},
      data: {
        writeKey: self.write_key,
        data: d
      },
      responseType: 'json' 
    };
    axios(options)
      .then(function(res) { resolve(res); })
      .catch(function(error) { reject(error.toJSON()); });
  });
};

ChirimenAmbient.prototype._makeQueryParam = function(options) {
  var _o = [];
  if (this.read_key != null) {
      _o.push('readKey=' + this.read_key);
  }
  if (typeof options.date !== 'undefined') {
      _o.push('date=' + options.date);
  } else {
      if (typeof options.start !== 'undefined' && typeof options.end !== 'undefined') {
          _o.push('start=' + options.start);
          _o.push('end=' + options.end);
      } else {
          if (typeof options.n !== 'undefined') {
              _o.push('n=' + options.n);
              if (typeof options.skip !== 'undefined') {
                  _o.push('skip=' + options.skip);
              }
          }
      }
  }
  var param = null;
  if (_o.length > 0) {
      param = _o.join('&');
  }
  return param;
};

ChirimenAmbient.prototype.read = function(settings) {
  var self = this;
  var opt = settings;
  return new Promise(function(resolve, reject) {
    var url = self.corsany + self.hostname + '/api/v2/channels/' + self.channel_id + '/data';
    var query_param = self._makeQueryParam(opt);
    if (query_param) {
        url = url + '?' + query_param;
    }
    var options = {
      method: 'get',
      url: url,
      headers: {'Content-Type': 'application/json'},
      responseType: 'json' 
    };
    console.log(options);
    axios(options)
      .then(function(res) {
        var response_data = res.data;
        resolve(response_data);
      }).catch(function(error) {
        reject(error.toJSON());
      });
  });
};

ChirimenAmbient.prototype._getNowDate = function(settings) {
  var d = new Date();
  var iso = d.toISOString().split('T');
  return iso[0];
};

ChirimenAmbient.prototype.readLatestOne = function(settings) {
  var self = this;
  var opt = null;
  if (!settings) {
    opt = {"date": this._getNowDate()};
  } else {
    if (settings.hasOwnProperty('date')) opt = {"date": settings.date};
  }
  return new Promise(function(resolve, reject) {
    var url = self.corsany + self.hostname + '/api/v2/channels/' + self.channel_id + '/data';
    var query_param = self._makeQueryParam(opt);
    if (query_param) {
        url = url + '?' + query_param;
    }
    var options = {
      method: 'get',
      url: url,
      headers: {'Content-Type': 'application/json'},
      responseType: 'json' 
    };
    axios(options)
      .then(function(res) {
        var response_data = null;
        if (res.data.length > 0) { response_data = res.data[0]; }
        resolve(response_data);
      }).catch(function(error) {
        reject(error.toJSON());
      });
  });
};
