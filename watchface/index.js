try {
  (() => {
    var n = __$$hmAppManager$$__.currentApp;
    const g = n.current,
      {
        px: e
      } =
      (new DeviceRuntimeCore.WidgetFactory(
          new DeviceRuntimeCore.HmDomApi(n, g)
        ),
        n.app.__globals__),
      p = Logger.getLogger("watchface6");
    const dayImags = [
      "2.png"
    ];
    const moonArray = ['m/1.png', 'm/2.png', 'm/3.png', 'm/4.png', 'm/5.png', 'm/6.png', 'm/7.png', 'm/8.png', 'm/9.png', 'm/10.png', 'm/11.png', 'm/12.png', 'm/13.png', 'm/14.png', 
      'm/15.png', 'm/16.png', 'm/17.png', 'm/18.png', 'm/19.png', 'm/20.png', 'm/21.png', 'm/22.png', 'm/23.png', 'm/24.png', 'm/25.png', 'm/26.png', 'm/27.png', 'm/28.png', 'm/29.png', 'm/30.png']
    const mbg = ['mo/1.png', 'mo/2.png', 'mo/3.png', 'mo/4.png', 'mo/5.png', 'mo/6.png', 'mo/7.png', 'mo/8.png']
    const mf = ['mo/1f.png', 'mo/2f.png', 'mo/3f.png', 'mo/4f.png', 'mo/5f.png', 'mo/6f.png', 'mo/7f.png', 'mo/8f.png']
      g.module = DeviceRuntimeCore.WatchFace({
      init_view() {
        const topBtnX = 55;
        const topBtnY = 0;
        const bottomBtnX = 55;
        const bottomBtnY = 440;
        const fullWidth = 192;
        const fullHeight = 490;

        // hmUI.createWidget(hmUI.widget.IMG, {
        //     x: 0,
        //     y: 0,
        //     w: 192,
        //     h: 490,
        //     src: "2.png",
        //     show_level: hmUI.show_level.ONLY_NORMAL
        //   }),
          var bg,fg;
          bg = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
            x: 0,
            y: 0,
            image_array: mbg,
            image_length: mbg.length,
            level: 4,
            show_level: hmUI.show_level.ONLY_NORMAL
          }),
          // hmUI.createWidget(hmUI.widget.IMG, {
          //   x: 0,
          //   y: 0,
          //   w: 50,
          //   h: 50,
          //   src: "m/15.png",
          //   show_level: hmUI.show_level.ONLY_NORMAL
          // }),
          hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
            x: 120,
            y: 130,
            image_array: moonArray,
            image_length: moonArray.length,
            level: 1,
            show_level: hmUI.show_level.ONLY_NORMAL
          }),

          
          
          hmUI.createWidget(hmUI.widget.IMG_TIME, {
            hour_zero: 0,
            hour_startX: 18,
            hour_startY: 77,
            hour_array: [
              "3.png",
              "4.png",
              "5.png",
              "6.png",
              "7.png",
              "8.png",
              "9.png",
              "10.png",
              "11.png",
              "12.png"
            ],
            hour_space: 3,
            hour_unit_sc: "13.png",
            hour_unit_tc: "13.png",
            hour_unit_en: "13.png",
            hour_align: hmUI.align.RIGHT,
            minute_zero: 1,
            minute_array: [
              "3.png",
              "4.png",
              "5.png",
              "6.png",
              "7.png",
              "8.png",
              "9.png",
              "10.png",
              "11.png",
              "12.png"
            ],
            minute_follow: 1,
            show_level: hmUI.show_level.ONLY_NORMAL
          }),
          hmUI.createWidget(hmUI.widget.IMG_DATE, {
            month_startX: 30,
            month_startY: 150,
            month_sc_array: [
              "14.png",
              "15.png",
              "16.png",
              "17.png",
              "18.png",
              "19.png",
              "20.png",
              "21.png",
              "22.png",
              "23.png"
            ],
            month_tc_array: [
              "14.png",
              "15.png",
              "16.png",
              "17.png",
              "18.png",
              "19.png",
              "20.png",
              "21.png",
              "22.png",
              "23.png"
            ],
            month_en_array: [
              "14.png",
              "15.png",
              "16.png",
              "17.png",
              "18.png",
              "19.png",
              "20.png",
              "21.png",
              "22.png",
              "23.png"
            ],
            month_unit_sc: "24.png",
            month_unit_tc: "24.png",
            month_unit_en: "24.png",
            month_align: hmUI.align.RIGHT,
            month_zero: 0,
            month_follow: 0,
            month_space: 1,
            month_is_character: !1,
            day_sc_array: [
              "14.png",
              "15.png",
              "16.png",
              "17.png",
              "18.png",
              "19.png",
              "20.png",
              "21.png",
              "22.png",
              "23.png"
            ],
            day_tc_array: [
              "14.png",
              "15.png",
              "16.png",
              "17.png",
              "18.png",
              "19.png",
              "20.png",
              "21.png",
              "22.png",
              "23.png"
            ],
            day_en_array: [
              "14.png",
              "15.png",
              "16.png",
              "17.png",
              "18.png",
              "19.png",
              "20.png",
              "21.png",
              "22.png",
              "23.png"
            ],
            day_zero: 1,
            day_follow: 1,
            day_is_character: !1,
            show_level: hmUI.show_level.ONLY_NORMAL
          }),
          hmUI.createWidget(hmUI.widget.IMG_WEEK, {
            x: 102,
            y: 190,
            week_en: [
              "25.png",
              "26.png",
              "27.png",
              "28.png",
              "29.png",
              "30.png",
              "31.png"
            ],
            week_tc: [
              "25.png",
              "26.png",
              "27.png",
              "28.png",
              "29.png",
              "30.png",
              "31.png"
            ],
            week_sc: [
              "25.png",
              "26.png",
              "27.png",
              "28.png",
              "29.png",
              "30.png",
              "31.png"
            ],
            show_level: hmUI.show_level.ONLY_NORMAL
          }),
            fg = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
              x: 0,
              y: 182,
              image_array: mf,
              image_length: mf.length,
              level: 4,
              show_level: hmUI.show_level.ONLY_NORMAL
            }),
          hmUI.createWidget(hmUI.widget.IMG, {
            x: 0,
            y: 0,
            w: 192,
            h: 490,
            src: "33.png",
            show_level: hmUI.show_level.ONLY_AOD
          }),
          hmUI.createWidget(hmUI.widget.TIME_POINTER, {
            hour_centerX: 96,
            hour_centerY: 245,
            hour_posX: 12,
            hour_posY: 68,
            hour_path: "34.png",
            hour_cover_path: "",
            hour_cover_x: 84,
            hour_cover_y: 233,
            minute_centerX: 96,
            minute_centerY: 245,
            minute_posX: 12,
            minute_posY: 84,
            minute_path: "36.png",
            minute_cover_path: "35.png",
            minute_cover_x: 84,
            minute_cover_y: 233,
            show_level: hmUI.show_level.ONLY_AOD
          });
          //更新月相图
        const jstime = hmSensor.createSensor(hmSensor.id.TIME)
        console.log(jstime)
        function updateMoonFace(){

        }
        //更新背景和前景图

          //状态显示
          const battery = hmSensor.createSensor(hmSensor.id.BATTERY)

          console.log('The current battery level is ' + battery.current + '\r\n')


        //---------------------------------小程序入口-------------------------------------
        //震动
        const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE)
        const views = [];
        
        var pages = ['home'];
        const img_bkg = hmUI.createWidget(hmUI.widget.IMG, { //小程序图标
          x: 44,
          y: 401,
          src: "apps.png",
          show_level: hmUI.show_level.ONLY_NORMAL
        })
        img_bkg.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] == 'home'){
            switchUI(false);
            pages.push("menu");
          }
        })

        function switchUI(b) {
          img_bkg.setProperty(hmUI.prop.VISIBLE, b);
          //txtBg.setProperty(hmUI.prop.VISIBLE, !b);
          setGroupVisible(txtGroup, !b);
          //txtGroup.setProperty(hmUI.prop.VISIBLE, !b);
          backBUtton.setProperty(hmUI.prop.VISIBLE, !b);
        }

        //---------------------------------菜单-------------------------------------

        let txtGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })

        setGroupVisible(txtGroup,false);

        txtGroup.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

        const app1Button = txtGroup.createWidget(hmUI.widget.BUTTON, {
          x: 0,
          y: 70,
          w: fullWidth,
          h: 50,
          press_color: 0x555555,
          normal_color: 0x3d3d3d,
          text: '微信收款',
          color: 0xffffff,
          text_size:24,
          click_func: app1
        })

        const app2Button = txtGroup.createWidget(hmUI.widget.BUTTON, {
          x: 0,
          y: 130,
          w: fullWidth,
          h: 50,
          press_color: 0x555555,
          normal_color: 0x3d3d3d,
          text: '支付宝收款',
          color: 0xffffff,
          text_size: 24,
          click_func: app2
        })

        const app3Button = txtGroup.createWidget(hmUI.widget.BUTTON, {
          x: 0,
          y: 190,
          w: fullWidth,
          h: 50,
          press_color: 0x555555,
          normal_color: 0x3d3d3d,
          text: '点数器',
          color: 0xffffff,
          text_size: 24,
          click_func: app3,
          
        })
        const app4Button = txtGroup.createWidget(hmUI.widget.BUTTON, {
          x: 0,
          y: 250,
          w: fullWidth,
          h: 50,
          press_color: 0x555555,
          normal_color: 0x3d3d3d,
          text: '吃什么',
          color: 0xffffff,
          text_size: 24,
          click_func: app4
        })

        const app5Button = txtGroup.createWidget(hmUI.widget.BUTTON, {
          x: 0,
          y: 310,
          w: fullWidth,
          h: 50,
          press_color: 0x555555,
          normal_color: 0x3d3d3d,
          text: '关于',
          color: 0xffffff,
          text_size: 24,
          click_func: app5
        })

        //---------------------------------微信收款-------------------------------------

        let app1Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app1Group, false)

        app1Group.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

        const editWechat = app1Group.createWidget(hmUI.widget.IMG, { //小程序图标
          x: bottomBtnX,
          y: bottomBtnY,
          w: fullWidth,
          h: 100,
          src: "edit.png"
        })

        editWechat.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app1") { return }
          goin(wechatEdit)
          wechatEdit.setProperty(hmUI.prop.VISIBLE, true)
          pages.push('edit')
        })

        let wechatEdit = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(wechatEdit, false)

        wechatEdit.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })


        //-------------------------------- 支付宝收款-------------------------------------

        let app2Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app2Group, false)

        app2Group.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

        const editAlipay = app2Group.createWidget(hmUI.widget.IMG, { //小程序图标
          x: bottomBtnX,
          y: bottomBtnY,
          src: "edit.png"
        })

        editAlipay.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app2") { return }
          goin(aliPayEdit)
          aliPayEdit.setProperty(hmUI.prop.VISIBLE, true)
          pages.push('edit')
        })

        let aliPayEdit = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(aliPayEdit, false)

        aliPayEdit.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

         //-------------------------------- 点数器-------------------------------------

        let count = 0;
        let app3Group = hmUI.createWidget(hmUI.widget.GROUP, { //点数器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        
        setGroupVisible(app3Group, false)

        app3Group.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

        const toZero = app3Group.createWidget(hmUI.widget.IMG, { //小程序图标
          x: bottomBtnX,
          y: bottomBtnY,
          src: "tozero.png"
        })

        toZero.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app3") { return }
          count = 0;
          countText.setProperty(hmUI.prop.MORE, {
            text: count
          });
        })

        const countBg = app3Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 100,
          w: fullWidth,
          h: 260,
          color:0xfffafa,
          text_size: 36,
          color: 0x0f0f0f,
          text: 0
        })

        const countText = app3Group.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 100,
          w: fullWidth,
          h:260,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,

          text_size:48,
          color: 0xffd700,
          text:0
        })

        let doVibrate = true;
        const switchVibrate = app3Group.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 380,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_size: 24,
          color: 0xaaaaaa,
          text: '震动开'
        })

        countText.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app3") { return }
          count ++;
          if (doVibrate){
            vibrate.motorenable = 1
            vibrate.crowneffecton = 1
            vibrate.scene = 2
            try{
              vibrate.stop()
              vibrate.start()
            }catch(e){
              console.log('不支持此功能')
              hmUI.showToast({
                text: '不支持此功能' // 支持多行显示
              })
            }
            
          }
          countText.setProperty(hmUI.prop.MORE,{
            text:count
          });
        })

        switchVibrate.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app3") { return }
          doVibrate = !doVibrate;
          switchVibrate.setProperty(hmUI.prop.MORE, {
            text: doVibrate ? '震动开' : '震动关'
          })
          
        })

        //--------------------------------吃什么-------------------------------------
        let fastFoods = ['云吞','拉面','烧烤','米线','螺蛳粉','汉堡','炸鸡','披萨','寿司','手抓饼','海鲜粥','羊肉粉','牛杂','焗饭','黄焖鸡',
        '猪脚饭','白切鸡','葱油鸡','烧鸭饭','烧鹅饭','麻辣烫','泡面','盖浇饭','泡馍','麻辣香锅','刀削面','热干面','桂林米粉','酸辣粉','饺子',
          '脆皮鸡饭', '关东煮', '凉皮', '烤肉拌饭', '包子', '馄饨', '炸酱面', '卤菜', '煲仔饭', '重庆小面', '意大利面', '酸菜鱼','炒饭','炒粉','咖喱饭'];
        let dinners = ['牛扒','水煮鱼','牛肉火锅','日料','烤鱼','海鲜火锅','冒菜','海鲜自助','烤肉自助','韩国菜','泰国菜','北京菜','麻辣火锅',
        '粤菜','川菜','东北菜','云南菜','江浙菜','西北菜','山东菜','徽菜','贵州菜','台湾菜','江西菜','茶餐厅','法国大餐','鱼火锅','酸菜鱼','小龙虾'];
        let fastFoodsStat = [];
        let dinnersStat = [];
        let app4Group = hmUI.createWidget(hmUI.widget.GROUP, { 
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app4Group, false)

        app4Group.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

        const fastfoodBtn = app4Group.createWidget(hmUI.widget.BUTTON, {
          x: 0,
          y: 130,
          w: fullWidth,
          h: 50,
          press_color: 0x555555,
          normal_color: 0x3d3d3d,
          text: '快餐',
          color: 0xffffff,
          text_size: 24,
          click_func: gotoFastfood
        })

        const dinnerBtn = app4Group.createWidget(hmUI.widget.BUTTON, {
          x: 0,
          y: 250,
          w: fullWidth,
          h: 50,
          press_color: 0x555555,
          normal_color: 0x3d3d3d,
          text: '正餐',
          color: 0xffffff,
          text_size: 24,
          click_func: gotoDinner,

        })

        let fastfoodGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(fastfoodGroup, false)

        fastfoodGroup.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

        const fastfoodText =  fastfoodGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 200,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          text_size: 32,
          color: 0xffd700,
          text:'云吞'
        })

          const fastfoodCount = fastfoodGroup.createWidget(hmUI.widget.TEXT, {
            x: 0,
            y: 250,
            w: fullWidth,
            h: 50,
            align_h: hmUI.align.CENTER_H,
            text_size: 18,
            color: 0xffffff,
            text: '还没选过'
          })

          const fastfoodSelect = fastfoodGroup.createWidget(hmUI.widget.TEXT, {
            x: 0,
            y: 350,
            w: fullWidth,
            h: 50,
            align_h: hmUI.align.CENTER_H,
            text_size: 24,
            color: 0xffffff,
            text: '选择'
          })

          let fastfoodIndex = 0;

          const refreshFastfood = fastfoodGroup.createWidget(hmUI.widget.IMG, { //小程序图标
            x: bottomBtnX,
            y: bottomBtnY,
            src: "refresh.png"
          })

          fastfoodSelect.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
            if (pages[pages.length - 1] != "fastfood") { return }
            if (fastfoodIndex == -1 ){return}
            if (typeof(fastFoodsStat[fastfoodIndex + '']) =='undefined'){
              fastFoodsStat[fastfoodIndex + ''] = 0;
            }else{
              fastFoodsStat[fastfoodIndex + ''] ++;
            }
            updateFastFoodCount()
          })

        refreshFastfood.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "fastfood") { return }
          fastfoodIndex = Math.round(Math.random() * fastFoods.length)
          updateFastFoodCount()
          fastfoodText.setProperty(hmUI.prop.MORE, {
            text: fastFoods[fastfoodIndex]
          });
        })

        function updateFastFoodCount(){
          fastfoodCount.setProperty(hmUI.prop.MORE, {
            text: fastFoodsStat[fastfoodIndex + ''] ? '已选' + fastFoodsStat[fastfoodIndex + ''] + '次' : '还没选过'
          });
        }

        let dinnerGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(dinnerGroup, false)

        dinnerGroup.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

        const dinnerText = dinnerGroup.createWidget(hmUI.widget.TEXT, { //小程序图标
          x: 0,
          y: 200,
          w: fullWidth,
          h: 100,
          align_h: hmUI.align.CENTER_H,
          text_size: 32,
          color: 0xffd700,
          text:'水煮鱼'
        })

          const dinnerCount = dinnerGroup.createWidget(hmUI.widget.TEXT, {
            x: 0,
            y: 250,
            w: fullWidth,
            h: 50,
            align_h: hmUI.align.CENTER_H,
            text_size: 18,
            color: 0xffffff,
            text: '还没选过'
          })

          const dinnerSelect = dinnerGroup.createWidget(hmUI.widget.TEXT, {
            x: 0,
            y: 350,
            w: fullWidth,
            h: 50,
            align_h: hmUI.align.CENTER_H,
            text_size: 24,
            color: 0xffffff,
            text: '选择'
          })


          var dinnerIndex = 1;
        const refreshDinner = dinnerGroup.createWidget(hmUI.widget.IMG, { //小程序图标
          x: bottomBtnX,
          y: bottomBtnY,
          src: "refresh.png"
        })

        refreshDinner.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "dinner") { return }
          dinnerIndex = Math.round(Math.random() * dinners.length)
          updateDinnerCount()
          dinnerText.setProperty(hmUI.prop.MORE, {
            text: dinners[dinnerIndex]
          });
        })

          dinnerSelect.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
            if (pages[pages.length - 1] != "dinner") { return }
            if (dinnerIndex == -1) { return }
            if (typeof (dinnersStat[dinnerIndex + '']) == 'undefined') {
              dinnersStat[dinnerIndex + ''] = 0;
            } else {
              dinnersStat[dinnerIndex + '']++;
            }
            updateDinnerCount()
          })

          function updateDinnerCount() {
            dinnerCount.setProperty(hmUI.prop.MORE, {
              text: dinnersStat[dinnerIndex + ''] ? '已选' + dinnersStat[dinnerIndex + ''] + '次' : '还没选过'
            });
          }

        function gotoFastfood(){
          if (pages[pages.length - 1] != "app4") { return }
          goin(fastfoodGroup)
          pages.push('fastfood')
        }

        function gotoDinner() {
          if (pages[pages.length - 1] != "app4") { return }
          goin(dinnerGroup)
          pages.push('dinner')
        }


        //--------------------------------关于-------------------------------------
        let app5Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app5Group, false)

        app5Group.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: 0x000000
        })

        app5Group.createWidget(hmUI.widget.TEXT,{
          x:5,
          y:100,
          w:fullWidth - 10,
          h:20,
          text:'增强版表盘',
          text_size:28,
          color: 0xffffff,
          text_style: hmUI.text_style.NONE
        })

        app5Group.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 130,
          w: fullWidth - 10,
          h: 20,
          text: '开发者：梁小蜗',
          text_size: 20,
          color: 0xffffff,
          text_style: hmUI.text_style.NONE
        })

        app5Group.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 160,
          w: fullWidth - 10,
          h: 20,
          text: '这是免费开源软件，如果您付费了，请联系卖家退款',
          align_h: hmUI.align.LEFT,
          text_size: 20,
          color: 0xffffff,
          text_style: hmUI.text_style.WRAP
        })

        app5Group.createWidget(hmUI.widget.IMG, {
          x: 5,
          y: 250,
          w: fullWidth - 10,
          h: 100,
          src: 'qr.png'
        })


       

        

        // 自定义组件部分
        // let txtWd = txtGroup.createWidget(hmUI.widget.TEXT,{      // 文本
        // 	x: 6,
        // 	y: 100,
        // 	w: 180,
        // 	h: 50,
        // 	color: "0x000000",
        // 	text_size: 20,
        // 	text_style: hmUI.text_style.WRAP,
        // 	text: '请发挥你的想象力吧！'
        // })

        // function backButtonClickFunc(button) { // 返回按钮
        //   switchUI(true);
        // }

        function app1(){
          if (pages[pages.length - 1] != "menu"){return}
          //setGroupVisible(app1Group, true)
            //app1Group.setProperty(hmUI.prop.VISIBLE, true);
            goin(app1Group)
           pages.push("app1")
        }
        function app2() {
          if (pages[pages.length - 1] != "menu") { return }
          //setGroupVisible(app2Group, true)
            //app2Group.setProperty(hmUI.prop.VISIBLE, true);
            goin(app2Group)
            pages.push("app2")
          }
        function app3() {
          if (pages[pages.length - 1] != "menu") { return }
          //setGroupVisible(app3Group, true)
            //app3Group.setProperty(hmUI.prop.VISIBLE, true);
            goin(app3Group)
            pages.push("app3")
          }
        function app4() {
          if (pages[pages.length - 1] != "menu") { return }
          //setGroupVisible(app4Group, true)
            //app4Group.setProperty(hmUI.prop.VISIBLE, true);
            goin(app4Group)
            pages.push("app4")
          }
        function app5() {
          if (pages[pages.length - 1] != "menu") { return }
          //setGroupVisible(app5Group, true)
          //app5Group.setProperty(hmUI.prop.VISIBLE, true);
          goin(app5Group)
          pages.push("app5")
        }

        function goback(){ //返回上一层
          if (pages.length > 1){
            pages.pop()
          }
          if (views.length <= 0){
            switchUI(true)
            
            return
          }
          var ui = views.pop();
          if(ui.type == 'GROUP'){
            setGroupVisible(ui,false)
          }
          
        }

        function setGroupVisible(ui,v){
          ui.setProperty(hmUI.prop.VISIBLE, v);
          ui.subWds.forEach(element => {
            element.setProperty(hmUI.prop.VISIBLE, v);
          });
        }

        function goin(ui){
          views.push(ui);
          setGroupVisible(ui, true);
        }


        // const backButton = txtGroup.createWidget(hmUI.widget.BUTTON, {
        //   x: 0,
        //   y: 0,
        //   w: 192,
        //   h: 50,
        //   press_color: 0xC3C3C3,
        //   normal_color: 0xEFEFEF,
        //   text: '返回',
        //   color: 0x000000,
        //   click_func: backButtonClickFunc
        // })


        const backBUtton = hmUI.createWidget(hmUI.widget.IMG, { //返回按键
          x: topBtnX,
          y: topBtnY,
          src: "back.png",
        })
        backBUtton.setProperty(hmUI.prop.VISIBLE, false);
        backBUtton.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          goback();
        })
      },
      onInit() {
        p.log("index page.js on init invoke");
      },
      build() {
        this.init_view(), p.log("index page.js on ready invoke");
      },
      onDestory() {
        p.log("index page.js on destory invoke");
      }
    });
  })();
} catch (n) {
  console.log(n);
}