#wct-mocha-teamcity-reporter

###WCT plugin for reporting in TeamCity.

[TeamCity Documentation](https://confluence.jetbrains.com/display/TCD8/Build+Script+Interaction+with+TeamCity#BuildScriptInteractionwithTeamCity-ReportingTests)

##Installing


```yarn add wct-mocha-teamcity-reporter ```

After installation, run wct with the plugin enabled: ```wct --plugin mocha-teamcity-reporter```

or you can also enable it in your ```wct.conf.js```

```
module.exports = {
  plugins: {
    local: {
      browsers: ['chrome']
    },
    sauce: false,
    'mocha-teamcity-reporter': true
  }
};
```
