# Chirimen Ambient

Send/Read sensor data to [Ambient](https://ambidata.io/) for the demo of [Chirimen](https://github.com/chirimen-oh/chirimen-raspi3).

# Initialize

```
var amb = new ChirimenAmbient();
amb.channel(AMBIENT_CHANNEL_ID, AMBIENT_READ_KEY, AMBIENT_WRITE_KEY);
```

# Send data

```
amb.send({"d1": sensorData})
  .then(function(r) { console.log(r); });
  .catch(function(e) { console.error(e); });
```

# Read data

```
amb.read({date: 'YYYY-MM-DD'})
  .then(function(r) { console.log(r); })
  .catch(function(e) { console.error(e); });
```

```
amb.readLatestOne()
  .then(function(r) { console.log(r); })
  .catch(function(e) { console.error(e); });
```

