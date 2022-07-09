//------------------------qrcode 相关代码开始------------------------
/**
 * @fileoverview
 * - Using the 'QRCode for Javascript library'
 * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
 * - this library has no dependencies.
 * 
 * @author davidshimjs
 * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
 * @see <a href="http://jeromeetienne.github.com/jquery-qrcode/" target="_blank">http://jeromeetienne.github.com/jquery-qrcode/</a>
 */
var QRCode;

(function () {
  //---------------------------------------------------------------------
  // QRCode for JavaScript
  //
  // Copyright (c) 2009 Kazuhiko Arase
  //
  // URL: http://www.d-project.com/
  //
  // Licensed under the MIT license:
  //   http://www.opensource.org/licenses/mit-license.php
  //
  // The word "QR Code" is registered trademark of 
  // DENSO WAVE INCORPORATED
  //   http://www.denso-wave.com/qrcode/faqpatent-e.html
  //
  //---------------------------------------------------------------------
  function QR8bitByte(data) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = data;
    this.parsedData = [];

    // Added to support UTF-8 Characters
    for (var i = 0, l = this.data.length; i < l; i++) {
      var byteArray = [];
      var code = this.data.charCodeAt(i);

      if (code > 0x10000) {
        byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
        byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
        byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
        byteArray[3] = 0x80 | (code & 0x3F);
      } else if (code > 0x800) {
        byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
        byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
        byteArray[2] = 0x80 | (code & 0x3F);
      } else if (code > 0x80) {
        byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
        byteArray[1] = 0x80 | (code & 0x3F);
      } else {
        byteArray[0] = code;
      }

      this.parsedData.push(byteArray);
    }

    this.parsedData = Array.prototype.concat.apply([], this.parsedData);

    if (this.parsedData.length != this.data.length) {
      this.parsedData.unshift(191);
      this.parsedData.unshift(187);
      this.parsedData.unshift(239);
    }
  }

  QR8bitByte.prototype = {
    getLength: function (buffer) {
      return this.parsedData.length;
    },
    write: function (buffer) {
      for (var i = 0, l = this.parsedData.length; i < l; i++) {
        buffer.put(this.parsedData[i], 8);
      }
    }
  };

  function QRCodeModel(typeNumber, errorCorrectLevel) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = [];
  }

  QRCodeModel.prototype = {
    addData: function (data) {
      var newData = new QR8bitByte(data);
      this.dataList.push(newData);
      this.dataCache = null;
    },
    isDark: function (row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error(row + "," + col);
      }
      return this.modules[row][col];
    },
    getModuleCount: function () {
      return this.moduleCount;
    },
    make: function () {
      this.makeImpl(false, this.getBestMaskPattern());
    },
    makeImpl: function (test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (var row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
        for (var col = 0; col < this.moduleCount; col++) {
          this.modules[row][col] = null;
        }
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);
      if (this.typeNumber >= 7) {
        this.setupTypeNumber(test);
      }
      if (this.dataCache == null) {
        this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
      }
      this.mapData(this.dataCache, maskPattern);
    },
    setupPositionProbePattern: function (row, col) {
      for (var r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (var c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    getBestMaskPattern: function () {
      var minLostPoint = 0;
      var pattern = 0;
      for (var i = 0; i < 8; i++) {
        this.makeImpl(true, i);
        var lostPoint = QRUtil.getLostPoint(this);
        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }
      return pattern;
    },
    createMovieClip: function (target_mc, instance_name, depth) {
      var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
      var cs = 1;
      this.make();
      for (var row = 0; row < this.modules.length; row++) {
        var y = row * cs;
        for (var col = 0; col < this.modules[row].length; col++) {
          var x = col * cs;
          var dark = this.modules[row][col];
          if (dark) {
            qr_mc.beginFill(0, 100);
            qr_mc.moveTo(x, y);
            qr_mc.lineTo(x + cs, y);
            qr_mc.lineTo(x + cs, y + cs);
            qr_mc.lineTo(x, y + cs);
            qr_mc.endFill();
          }
        }
      }
      return qr_mc;
    },
    setupTimingPattern: function () {
      for (var r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] != null) {
          continue;
        }
        this.modules[r][6] = (r % 2 == 0);
      }
      for (var c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] != null) {
          continue;
        }
        this.modules[6][c] = (c % 2 == 0);
      }
    },
    setupPositionAdjustPattern: function () {
      var pos = QRUtil.getPatternPosition(this.typeNumber);
      for (var i = 0; i < pos.length; i++) {
        for (var j = 0; j < pos.length; j++) {
          var row = pos[i];
          var col = pos[j];
          if (this.modules[row][col] != null) {
            continue;
          }
          for (var r = -2; r <= 2; r++) {
            for (var c = -2; c <= 2; c++) {
              if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    },
    setupTypeNumber: function (test) {
      var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
      for (var i = 0; i < 18; i++) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
      }
      for (var i = 0; i < 18; i++) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    },
    setupTypeInfo: function (test, maskPattern) {
      var data = (this.errorCorrectLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);
      for (var i = 0; i < 15; i++) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        if (i < 6) {
          this.modules[i][8] = mod;
        } else if (i < 8) {
          this.modules[i + 1][8] = mod;
        } else {
          this.modules[this.moduleCount - 15 + i][8] = mod;
        }
      }
      for (var i = 0; i < 15; i++) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        if (i < 8) {
          this.modules[8][this.moduleCount - i - 1] = mod;
        } else if (i < 9) {
          this.modules[8][15 - i - 1 + 1] = mod;
        } else {
          this.modules[8][15 - i - 1] = mod;
        }
      }
      this.modules[this.moduleCount - 8][8] = (!test);
    },
    mapData: function (data, maskPattern) {
      var inc = -1;
      var row = this.moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      for (var col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col--;
        while (true) {
          for (var c = 0; c < 2; c++) {
            if (this.modules[row][col - c] == null) {
              var dark = false;
              if (byteIndex < data.length) {
                dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
              }
              var mask = QRUtil.getMask(maskPattern, row, col - c);
              if (mask) {
                dark = !dark;
              }
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex == -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
  };
  QRCodeModel.PAD0 = 0xEC;
  QRCodeModel.PAD1 = 0x11;
  QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
    var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    var buffer = new QRBitBuffer();
    for (var i = 0; i < dataList.length; i++) {
      var data = dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
      data.write(buffer);
    }
    var totalDataCount = 0;
    for (var i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].dataCount;
    }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error("code length overflow. (" +
        buffer.getLengthInBits() +
        ">" +
        totalDataCount * 8 +
        ")");
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(QRCodeModel.PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(QRCodeModel.PAD1, 8);
    }
    return QRCodeModel.createBytes(buffer, rsBlocks);
  };
  QRCodeModel.createBytes = function (buffer, rsBlocks) {
    var offset = 0;
    var maxDcCount = 0;
    var maxEcCount = 0;
    var dcdata = new Array(rsBlocks.length);
    var ecdata = new Array(rsBlocks.length);
    for (var r = 0; r < rsBlocks.length; r++) {
      var dcCount = rsBlocks[r].dataCount;
      var ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (var i = 0; i < dcdata[r].length; i++) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      }
      offset += dcCount;
      var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      var modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (var i = 0; i < ecdata[r].length; i++) {
        var modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
      }
    }
    var totalCodeCount = 0;
    for (var i = 0; i < rsBlocks.length; i++) {
      totalCodeCount += rsBlocks[i].totalCount;
    }
    var data = new Array(totalCodeCount);
    var index = 0;
    for (var i = 0; i < maxDcCount; i++) {
      for (var r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i];
        }
      }
    }
    for (var i = 0; i < maxEcCount; i++) {
      for (var r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i];
        }
      }
    }
    return data;
  };
  var QRMode = {
    MODE_NUMBER: 1 << 0,
    MODE_ALPHA_NUM: 1 << 1,
    MODE_8BIT_BYTE: 1 << 2,
    MODE_KANJI: 1 << 3
  };
  var QRErrorCorrectLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
  };
  var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
  };
  var QRUtil = {
    PATTERN_POSITION_TABLE: [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ],
    G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
    getBCHTypeInfo: function (data) {
      var d = data << 10;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
        d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
      }
      return ((data << 10) | d) ^ QRUtil.G15_MASK;
    },
    getBCHTypeNumber: function (data) {
      var d = data << 12;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
        d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18)));
      }
      return (data << 12) | d;
    },
    getBCHDigit: function (data) {
      var digit = 0;
      while (data != 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    },
    getPatternPosition: function (typeNumber) {
      return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },
    getMask: function (maskPattern, i, j) {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return (i + j) % 2 == 0;
        case QRMaskPattern.PATTERN001:
          return i % 2 == 0;
        case QRMaskPattern.PATTERN010:
          return j % 3 == 0;
        case QRMaskPattern.PATTERN011:
          return (i + j) % 3 == 0;
        case QRMaskPattern.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
        case QRMaskPattern.PATTERN101:
          return (i * j) % 2 + (i * j) % 3 == 0;
        case QRMaskPattern.PATTERN110:
          return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
        case QRMaskPattern.PATTERN111:
          return ((i * j) % 3 + (i + j) % 2) % 2 == 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    },
    getErrorCorrectPolynomial: function (errorCorrectLength) {
      var a = new QRPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    },
    getLengthInBits: function (mode, type) {
      if (1 <= type && type < 10) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            throw new Error("mode:" + mode);
        }
      } else if (type < 27) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 12;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 10;
          default:
            throw new Error("mode:" + mode);
        }
      } else if (type < 41) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 13;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            throw new Error("mode:" + mode);
        }
      } else {
        throw new Error("type:" + type);
      }
    },
    getLostPoint: function (qrCode) {
      var moduleCount = qrCode.getModuleCount();
      var lostPoint = 0;
      for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount; col++) {
          var sameCount = 0;
          var dark = qrCode.isDark(row, col);
          for (var r = -1; r <= 1; r++) {
            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }
            for (var c = -1; c <= 1; c++) {
              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }
              if (r == 0 && c == 0) {
                continue;
              }
              if (dark == qrCode.isDark(row + r, col + c)) {
                sameCount++;
              }
            }
          }
          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      }
      for (var row = 0; row < moduleCount - 1; row++) {
        for (var col = 0; col < moduleCount - 1; col++) {
          var count = 0;
          if (qrCode.isDark(row, col)) count++;
          if (qrCode.isDark(row + 1, col)) count++;
          if (qrCode.isDark(row, col + 1)) count++;
          if (qrCode.isDark(row + 1, col + 1)) count++;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }
      for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount - 6; col++) {
          if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
            lostPoint += 40;
          }
        }
      }
      for (var col = 0; col < moduleCount; col++) {
        for (var row = 0; row < moduleCount - 6; row++) {
          if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
            lostPoint += 40;
          }
        }
      }
      var darkCount = 0;
      for (var col = 0; col < moduleCount; col++) {
        for (var row = 0; row < moduleCount; row++) {
          if (qrCode.isDark(row, col)) {
            darkCount++;
          }
        }
      }
      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;
      return lostPoint;
    }
  };
  var QRMath = {
    glog: function (n) {
      if (n < 1) {
        throw new Error("glog(" + n + ")");
      }
      return QRMath.LOG_TABLE[n];
    },
    gexp: function (n) {
      while (n < 0) {
        n += 255;
      }
      while (n >= 256) {
        n -= 255;
      }
      return QRMath.EXP_TABLE[n];
    },
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256)
  };
  for (var i = 0; i < 8; i++) {
    QRMath.EXP_TABLE[i] = 1 << i;
  }
  for (var i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
  }
  for (var i = 0; i < 255; i++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
  }

  function QRPolynomial(num, shift) {
    if (num.length == undefined) {
      throw new Error(num.length + "/" + shift);
    }
    var offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset++;
    }
    this.num = new Array(num.length - offset + shift);
    for (var i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
  }
  QRPolynomial.prototype = {
    get: function (index) {
      return this.num[index];
    },
    getLength: function () {
      return this.num.length;
    },
    multiply: function (e) {
      var num = new Array(this.getLength() + e.getLength() - 1);
      for (var i = 0; i < this.getLength(); i++) {
        for (var j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
        }
      }
      return new QRPolynomial(num, 0);
    },
    mod: function (e) {
      if (this.getLength() - e.getLength() < 0) {
        return this;
      }
      var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
      var num = new Array(this.getLength());
      for (var i = 0; i < this.getLength(); i++) {
        num[i] = this.get(i);
      }
      for (var i = 0; i < e.getLength(); i++) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
      }
      return new QRPolynomial(num, 0).mod(e);
    }
  };

  function QRRSBlock(totalCount, dataCount) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }
  QRRSBlock.RS_BLOCK_TABLE = [
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12],
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];
  QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
    var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    if (rsBlock == undefined) {
      throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
    }
    var length = rsBlock.length / 3;
    var list = [];
    for (var i = 0; i < length; i++) {
      var count = rsBlock[i * 3 + 0];
      var totalCount = rsBlock[i * 3 + 1];
      var dataCount = rsBlock[i * 3 + 2];
      for (var j = 0; j < count; j++) {
        list.push(new QRRSBlock(totalCount, dataCount));
      }
    }
    return list;
  };
  QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return undefined;
    }
  };

  function QRBitBuffer() {
    this.buffer = [];
    this.length = 0;
  }
  QRBitBuffer.prototype = {
    get: function (index) {
      var bufIndex = Math.floor(index / 8);
      return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
    },
    put: function (num, length) {
      for (var i = 0; i < length; i++) {
        this.putBit(((num >>> (length - i - 1)) & 1) == 1);
      }
    },
    getLengthInBits: function () {
      return this.length;
    },
    putBit: function (bit) {
      var bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
      }
      this.length++;
    }
  };
  var QRCodeLimitLength = [
    [17, 14, 11, 7],
    [32, 26, 20, 14],
    [53, 42, 32, 24],
    [78, 62, 46, 34],
    [106, 84, 60, 44],
    [134, 106, 74, 58],
    [154, 122, 86, 64],
    [192, 152, 108, 84],
    [230, 180, 130, 98],
    [271, 213, 151, 119],
    [321, 251, 177, 137],
    [367, 287, 203, 155],
    [425, 331, 241, 177],
    [458, 362, 258, 194],
    [520, 412, 292, 220],
    [586, 450, 322, 250],
    [644, 504, 364, 280],
    [718, 560, 394, 310],
    [792, 624, 442, 338],
    [858, 666, 482, 382],
    [929, 711, 509, 403],
    [1003, 779, 565, 439],
    [1091, 857, 611, 461],
    [1171, 911, 661, 511],
    [1273, 997, 715, 535],
    [1367, 1059, 751, 593],
    [1465, 1125, 805, 625],
    [1528, 1190, 868, 658],
    [1628, 1264, 908, 698],
    [1732, 1370, 982, 742],
    [1840, 1452, 1030, 790],
    [1952, 1538, 1112, 842],
    [2068, 1628, 1168, 898],
    [2188, 1722, 1228, 958],
    [2303, 1809, 1283, 983],
    [2431, 1911, 1351, 1051],
    [2563, 1989, 1423, 1093],
    [2699, 2099, 1499, 1139],
    [2809, 2213, 1579, 1219],
    [2953, 2331, 1663, 1273]
  ];



  /**
   * Get the type by string length
   * 
   * @private
   * @param {String} sText
   * @param {Number} nCorrectLevel
   * @return {Number} type
   */
  function _getTypeNumber(sText, nCorrectLevel) {
    var nType = 1;
    var length = _getUTF8Length(sText);

    for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
      var nLimit = 0;

      switch (nCorrectLevel) {
        case QRErrorCorrectLevel.L:
          nLimit = QRCodeLimitLength[i][0];
          break;
        case QRErrorCorrectLevel.M:
          nLimit = QRCodeLimitLength[i][1];
          break;
        case QRErrorCorrectLevel.Q:
          nLimit = QRCodeLimitLength[i][2];
          break;
        case QRErrorCorrectLevel.H:
          nLimit = QRCodeLimitLength[i][3];
          break;
      }

      if (length <= nLimit) {
        break;
      } else {
        nType++;
      }
    }

    if (nType > QRCodeLimitLength.length) {
      throw new Error("Too long data");
    }

    return nType;
  }

  function _getUTF8Length(sText) {
    var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
    return replacedText.length + (replacedText.length != sText ? 3 : 0);
  }

  /**
   * @class QRCode
   * @constructor
   * @example 
   * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
   *
   * @example
   * var oQRCode = new QRCode("test", {
   *    text : "http://naver.com",
   *    width : 128,
   *    height : 128
   * });
   * 
   * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
   *
   * @param {HTMLElement|String} el target element or 'id' attribute of element.
   * @param {Object|String} vOption
   * @param {String} vOption.text QRCode link data
   * @param {Number} [vOption.width=256]
   * @param {Number} [vOption.height=256]
   * @param {String} [vOption.colorDark="#000000"]
   * @param {String} [vOption.colorLight="#ffffff"]
   * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H] 
   */
  QRCode = function (vOption) {
    this._htOption = {
      width: 256,
      height: 256,
      typeNumber: 4,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRErrorCorrectLevel.H
    };

    if (typeof vOption === 'string') {
      vOption = {
        text: vOption
      };
    }

    // Overwrites options
    if (vOption) {
      for (var i in vOption) {
        this._htOption[i] = vOption[i];
      }
    }

    this._oQRCode = null;

    if (this._htOption.text) {
      return this.makeCode(this._htOption.text);
    }
  };

  /**
   * Make the QRCode
   * 
   * @param {String} sText link data
   */
  QRCode.prototype.makeCode = function (sText) {
    this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
    this._oQRCode.addData(sText);
    this._oQRCode.make();
    return this.getStr(this._oQRCode);
  };

  QRCode.prototype.getStr = function (str) {
    var result = '';
    var nCount = this._oQRCode.getModuleCount();
    console.log("nCount:" + nCount + '\n')
    

    for (var row = 0; row < nCount; row++) {
      for (var col = 0; col < nCount; col++) {
        var bIsDark = this._oQRCode.isDark(row, col);
        result += bIsDark ? '■' : '  '
      }
      //result += '\n'
    }
    this._bIsPainted = true;
    return result
  }


  /**
   * @name QRCode.CorrectLevel
   */
  QRCode.CorrectLevel = QRErrorCorrectLevel;
})();

//------------------------qrcode 相关代码结束------------------------
//------------------------表盘开始------------------------
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
        n.app.__globals__)
    let p
    try{
      p = DeviceRuntimeCore.HmLogger.getLogger("watchface6");
    }catch(e){}
     
    //资源链接------------------------
    const moonArray = ['m/1.png', 'm/2.png', 'm/3.png', 'm/4.png', 'm/5.png', 'm/6.png', 'm/7.png', 'm/8.png', 'm/9.png', 'm/10.png', 'm/11.png', 'm/12.png', 'm/13.png', 'm/14.png',
      'm/15.png', 'm/16.png', 'm/17.png', 'm/18.png', 'm/19.png', 'm/20.png', 'm/21.png', 'm/22.png', 'm/23.png', 'm/24.png', 'm/25.png', 'm/26.png', 'm/27.png', 'm/28.png', 'm/29.png', 'm/30.png'
    ]
    const mbg = ['mo/1.png', 'mo/2.png', 'mo/3.png', 'mo/4.png', 'mo/5.png', 'mo/6.png', 'mo/7.png', 'mo/8.png']
    const mf = ['mo/1f.png', 'mo/2f.png', 'mo/3f.png', 'mo/4f.png', 'mo/5f.png', 'mo/6f.png', 'mo/7f.png', 'mo/8f.png']
    
    let mainTimer

    const topBtnX = 55;
    const topBtnY = 2;
    const bottomBtnX = 55;
    const bottomBtnY = 425;
    const fullWidth = 192;
    const fullHeight = 490;
    const iconBtnW = 65;

    const normalFont = 22;
    const titleFont = 28;
    const smallFont = 16;
    const tinyFont = 12;
    const xTinyFont = 10;

    const darkBG = 0x000000;
    const lightBG = 0x202020;
    const lightText = 0xffffff;
    const darkText = 0x000000;
    const gold = 0xffd700;
    const secondText = 0xa5a5a5;
    const orange = 0xfc512d;
    const btnPress = 0x555555;
    

    function showToast(t) {
      try {
        hmUI.showToast({
          text: t
        })
      } catch (e) { }
    }
    g.module = DeviceRuntimeCore.WatchFace({
      init_view() {
        var bg
        var fg
        var moonface
        bg = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
            x: 0,
            y: 0,
            image_array: mbg,
            image_length: mbg.length,
            level: 1,
            show_level: hmUI.show_level.ONLY_NORMAL
          }),
          moonface = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
            x: 157,
            y: 150,
            image_array: moonArray,
            image_length: moonArray.length,
            level: 1,
            show_level: hmUI.show_level.ONLY_NORMAL
          }),

          hmUI.createWidget(hmUI.widget.IMG_TIME, {
            hour_zero: 0,
            hour_startX: 18,
            hour_startY: 77,
            hour_array: ["3.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png","11.png","12.png"],
            hour_space: 3,
            hour_unit_sc: "13.png",
            hour_unit_tc: "13.png",
            hour_unit_en: "13.png",
            hour_align: hmUI.align.RIGHT,
            minute_zero: 1,
            minute_array: ["3.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png","11.png","12.png"],
            minute_follow: 1,
            show_level: hmUI.show_level.ONLY_NORMAL
          }),
          hmUI.createWidget(hmUI.widget.IMG_DATE, {
            month_startX: 15,
            month_startY: 150,
            month_sc_array: ["14.png","15.png","16.png","17.png","18.png","19.png","20.png","21.png","22.png","23.png"],
            month_tc_array: ["14.png","15.png","16.png","17.png","18.png","19.png","20.png","21.png","22.png","23.png"],
            month_en_array: ["14.png", "15.png", "16.png", "17.png", "18.png", "19.png", "20.png", "21.png", "22.png", "23.png"],
            month_unit_sc: "24.png",
            month_unit_tc: "24.png",
            month_unit_en: "24.png",
            month_align: hmUI.align.RIGHT,
            month_zero: 0,
            month_follow: 0,
            month_space: 1,
            month_is_character: !1,
            day_sc_array: ["14.png","15.png","16.png","17.png","18.png","19.png","20.png","21.png","22.png","23.png"],
            day_tc_array: ["14.png", "15.png", "16.png", "17.png", "18.png", "19.png", "20.png", "21.png", "22.png", "23.png"],
            day_en_array: ["14.png", "15.png", "16.png", "17.png", "18.png", "19.png", "20.png", "21.png", "22.png", "23.png"],
            day_zero: 1,
            day_follow: 1,
            day_is_character: !1,
            show_level: hmUI.show_level.ONLY_NORMAL
          }),
          hmUI.createWidget(hmUI.widget.IMG_WEEK, {
            x: 102,
            y: 190,
            week_en: ["25.png","26.png","27.png","28.png","29.png","30.png","31.png"],
            week_tc: ["25.png", "26.png", "27.png", "28.png", "29.png", "30.png", "31.png"],
            week_sc: ["25.png", "26.png", "27.png", "28.png", "29.png", "30.png", "31.png"],
            show_level: hmUI.show_level.ONLY_NORMAL
          })
        fg = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
            x: 0,
            y: 182,
            image_array: mf,
            image_length: mf.length,
            level: 1,
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


        const jstime = hmSensor.createSensor(hmSensor.id.TIME)
        showToast('lunar_day:' + jstime.lunar_day + '\n')
        console.log(jstime)
        //定时器每30分钟更新背景图和月相图
        
        try {
          mainTimer = createTimer(
            100,
            1800000,
            function (option) {
              var h = Math.ceil(jstime.hour / 3) //jstime.hour
              if (h > mbg.length) {
                return
              }
              bg.setProperty(hmUI.prop.MORE, {
                level: h - 1
              })
              fg.setProperty(hmUI.prop.MORE, {
                level: h - 1
              })
              updateMoonFace()
            }
          );
        } catch (e) {}

        function updateMoonFace() {
          try {
            var ld = jstime.lunar_day
            if (typeof (ld) == 'undefined') {
              return
            }
            moonface.setProperty(hmUI.prop.MORE, {
              level: ld - 1
            })
          } catch (e) {
            console.log('不支持农历\n')
          }
        }
        //更新背景和前景图

        //todo 状态显示
        const battery = hmSensor.createSensor(hmSensor.id.BATTERY)

        //---------------------------------小程序入口-------------------------------------
        //震动
        const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE)
        const views = [];

        var pages = ['home'];
        const img_bkg = hmUI.createWidget(hmUI.widget.IMG, { //小程序图标
          x: 38,
          y: 401,

          src: "apps.png",
          show_level: hmUI.show_level.ONLY_NORMAL
        })
        img_bkg.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] == 'home') {
            switchUI(false);
            pages.push("menu");
          }
        })

        function switchUI(b) {
          img_bkg.setProperty(hmUI.prop.VISIBLE, b);
          setGroupVisible(txtGroup, !b);
          backBUtton.setProperty(hmUI.prop.VISIBLE, !b);
        }

        //---------------------------------菜单-------------------------------------

        let txtGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })

        setGroupVisible(txtGroup, false);

        txtGroup.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        var apps = [
          {text:'微信收款',id:1},
          {text: '支付宝收款', id: 2},
          { text: '点数器', id: 3 },
          { text: '吃什么', id: 4 },
          { text: '尺子', id: 6 },
          { text: '关于', id: 5 },
        ]

        for (let i = 0; i < apps.length; i++) {
          const app = apps[i];
          txtGroup.createWidget(hmUI.widget.BUTTON, {
            x: 5,
            y: 70 + i * 60,
            w: fullWidth - 10,
            h: 50,
            press_color: lightBG,
            normal_color: btnPress,
            text: app['text'],
            color: lightText,
            text_size: normalFont,
            radius:15,
            click_func: () => { openApp(app['id'],) }
          })
        }

        //---------------------------------微信收款-------------------------------------

        let app1Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app1Group, false)

        app1Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: lightText
        })

        app1Group.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 60,
          w: fullWidth,
          h: 50,
          color: darkBG,
          text: "微信收款",
          text_size: titleFont,
          text_style: hmUI.text_style.NONE,
          align_h: hmUI.align.CENTER_H,
        })

        app1Group.createWidget(hmUI.widget.IMG, {
          x: 3,
          y: 120,
          src: 'qr/wechat.png',
          w: 186,
          h: 186,
        })

        const textCode = app1Group.createWidget(hmUI.widget.TEXT, {
          x: 9,
          y: 150,
          w: 180,
          h: 192,
          color: darkBG,
          text: "",
          text_size: 6,
          text_style: hmUI.text_style.WRAP,
        })

        app1Group.createWidget(hmUI.widget.IMG, {
          x: 74,
          y: 350,
          src: 'wechat.png'
        })

        var wechatCode = "wxp://f2f0eWEfpXmzZbm81ToT4fYhhnx1_w1Lv"

        function updateWechatCode() {
          var qrcode = new QRCode({
            text: wechatCode,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
          });
          var str = qrcode.getStr()
          var cols = qrcode._oQRCode.getModuleCount()
          showToast('qrcode Rows:' + cols)

          if (cols > 100) {
            textCode.setProperty(hmUI.prop.MORE, {
              text: "二维码过大",
              text_size: 18,
            })
            return
          } 
          textCode.setProperty(hmUI.prop.MORE, {
            x: Math.floor((fullWidth - 4) % cols / 2),
            text_size: Math.floor((fullWidth - 4) / cols),
            w: Math.floor((fullWidth - 4) / cols) * cols + 1,
            text: str
          })
        }

        const editWechat = app1Group.createWidget(hmUI.widget.IMG, {
          x: (fullWidth - iconBtnW) /2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "edit.png"
        })

        editWechat.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app1") {
            return
          }
          showToast('暂未实现')
          return
          goin(wechatEdit)
          wechatEdit.setProperty(hmUI.prop.VISIBLE, true)
          pages.push('edit')
          inputTarget = 'wechat'
          setGroupVisible(inputGroup, true)
          inputStr = wechatCode
          updateInputBox()
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
          color: darkBG
        })


        //-------------------------------- 支付宝收款-------------------------------------

        let app2Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app2Group, false)

        app2Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: lightText
        })

        app2Group.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 60,
          w: fullWidth,
          h: 50,
          color: darkBG,
          text: "支付宝收款",
          text_size: titleFont,
          text_style: hmUI.text_style.NONE,
          align_h: hmUI.align.CENTER_H,
        })

        app2Group.createWidget(hmUI.widget.IMG, {
          x: 3,
          y: 120,
          src: 'qr/alipay.png',
          w: 186,
          h: 186,
        })

        // const alpay = app2Group.createWidget(hmUI.widget.TEXT, {
        //   x: 9,
        //   y: 115,
        //   w: 180,
        //   h: 240,
        //   color: darkBG,
        //   text: "",
        //   text_size: 6,
        //   line_space: 0,
        //   char_space: 0,
        //   text_style: hmUI.text_style.WRAP,
        // })

        // app2Group.createWidget(hmUI.widget.IMG, {
        //   x: 77,
        //   y: 365,
        //   src: 'alipay.png'
        // })

        // var alipayCode = "https://qr.alipay.com/fkx181795dfsbwm8usxip57"

        // function updateAlipayCode() {
        //   var qrcode = new QRCode({
        //     text: alipayCode,
        //     width: 128,
        //     height: 128,
        //     colorDark: "#000000",
        //     colorLight: "#ffffff",
        //     correctLevel: QRCode.CorrectLevel.L
        //   });
        //   var str = qrcode.getStr()
        //   var cols = qrcode._oQRCode.getModuleCount()
        //   showToast('qrcode Rows:' + cols)
        //   if (cols > 100) {
        //     alpay.setProperty(hmUI.prop.MORE, {
        //       text: "二维码过大",
        //       text_size: 18,
        //     })
        //     return
        //   }
        //   alpay.setProperty(hmUI.prop.MORE, {
        //     x: Math.floor((fullWidth - 4) % cols / 2),
        //     text_size: Math.floor((fullWidth - 4) / cols),
        //     w: Math.floor((fullWidth - 4) / cols) * cols + 1,
        //     text: str
        //   })
        // }
        

        const editAlipay = app2Group.createWidget(hmUI.widget.IMG, {
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "edit.png"
        })

        editAlipay.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app2") {
            return
          }
          showToast('暂未实现')
          return
          goin(aliPayEdit)
          aliPayEdit.setProperty(hmUI.prop.VISIBLE, true)
          pages.push('edit')
          inputTarget = 'alipay'
          setGroupVisible(inputGroup, true)
          inputStr = alipayCode
          updateInputBox()
        })

        let aliPayEdit = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(aliPayEdit, false)

        aliPayEdit.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        //-------------------------------- 点数器-------------------------------------

        let count = 0;
        let doVibrate = true;

        let app3Group = hmUI.createWidget(hmUI.widget.GROUP, { //点数器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app3Group, false)

        app3Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        app3Group.createWidget(hmUI.widget.BUTTON, {
          x: 45,
          y: 60,
          w: 102,
          h:50,
          text:'归零',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            if (pages[pages.length - 1] != "app3") {
              return
            }
            count = 0;
            countText.setProperty(hmUI.prop.MORE, {
              text: count
            });
          }
        })

        const switchVibrate =  app3Group.createWidget(hmUI.widget.BUTTON, {
          x: 45,
          y: 120,
          w: 102,
          h: 50,
          text: '震动',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            if (pages[pages.length - 1] != "app3") {
              return
            }
            doVibrate = !doVibrate;
          }
        })

        const countText = app3Group.createWidget(hmUI.widget.TEXT, {
          x: 2,
          y: 172,
          w: fullWidth - 4,
          h: 70,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_size: 56,
          color: gold,
          text: 0
        })

        const addCount = app3Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 242,
          w: fullWidth,
          h: 250,
          radius: fullWidth / 2,
          color: lightBG,
          text_size: 36,
          text: 0
        })

        app3Group.createWidget(hmUI.widget.TEXT, {
          x: 2,
          y: 250,
          w: fullWidth - 4,
          h: 18,
          text_size: smallFont,
          color: secondText,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text: "点击+1"
        })

        

        addCount.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app3") {
            return
          }
          count++;
          if (doVibrate) {
            vibrate.motorenable = 1
            vibrate.crowneffecton = 1
            vibrate.scene = 2
            try {
              vibrate.stop()
              vibrate.start()
            } catch (e) {
              showToast('不支持震动\n')
            }
          }
          countText.setProperty(hmUI.prop.MORE, {
            text: count
          });
        })

        //--------------------------------吃什么-------------------------------------
        let fastFoods = ['云吞', '拉面', '烧烤', '米线', '螺蛳粉', '汉堡', '炸鸡', '披萨', '寿司', '手抓饼', '海鲜粥', '羊肉粉', '牛杂', '焗饭', '黄焖鸡',
          '猪脚饭', '白切鸡', '葱油鸡', '烧鸭饭', '烧鹅饭', '麻辣烫', '泡面', '盖浇饭', '泡馍', '麻辣香锅', '刀削面', '热干面', '桂林米粉', '酸辣粉', '饺子',
          '脆皮鸡饭', '关东煮', '凉皮', '烤肉拌饭', '包子', '馄饨', '炸酱面', '卤菜', '煲仔饭', '重庆小面', '意大利面', '酸菜鱼', '炒饭', '炒粉', '咖喱饭'
        ];
        let dinners = ['牛扒', '水煮鱼', '牛肉火锅', '日料', '烤鱼', '海鲜火锅', '冒菜', '海鲜自助', '烤肉自助', '韩国菜', '泰国菜', '北京菜', '麻辣火锅',
          '粤菜', '川菜', '东北菜', '云南菜', '江浙菜', '西北菜', '山东菜', '徽菜', '贵州菜', '台湾菜', '江西菜', '茶餐厅', '法国大餐', '鱼火锅', '酸菜鱼', '小龙虾'
        ];
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
          color: darkBG
        })

        app4Group.createWidget(hmUI.widget.BUTTON, {
          x: 5,
          y: 130,
          w: fullWidth - 10,
          h: 50,
          radius: 15,
          press_color: lightBG,
          normal_color: btnPress,
          text: '快餐',
          color: lightText,
          text_size: normalFont,
          click_func: () => { gotoFastfood() }
        })

        app4Group.createWidget(hmUI.widget.BUTTON, {
          x: 5,
          y: 250,
          w: fullWidth -10,
          h: 50,
          radius:15,
          press_color: lightBG,
          normal_color: btnPress,
          text: '正餐',
          color: lightText,
          text_size: normalFont,
          click_func: () => { gotoDinner() }
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
          color: darkBG
        })

        const fastfoodText = fastfoodGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 200,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          text_size: 32,
          color: gold,
          text: '云吞'
        })

        const fastfoodCount = fastfoodGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 250,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          text_size: smallFont,
          color: lightText,
          text: '还没选过'
        })

        fastfoodGroup.createWidget(hmUI.widget.BUTTON, {
          x: 45,
          y: 350,
          w: 102,
          h: 50,
          text: '选择',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: smallFont,
          radius: 15,
          click_func: () => {
            if (pages[pages.length - 1] != "fastfood") {
              return
            }
            if (fastfoodIndex == -1) {
              return
            }
            if (typeof (fastFoodsStat[fastfoodIndex + '']) == 'undefined') {
              fastFoodsStat[fastfoodIndex + ''] = 0;
            } else {
              fastFoodsStat[fastfoodIndex + '']++;
            }
            updateFastFoodCount()
          }
        })

        let fastfoodIndex = 0;

        const refreshFastfood = fastfoodGroup.createWidget(hmUI.widget.IMG, { //小程序图标
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "refresh.png"
        })

        refreshFastfood.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "fastfood") {
            return
          }
          fastfoodIndex = Math.round(Math.random() * fastFoods.length)
          updateFastFoodCount()
          fastfoodText.setProperty(hmUI.prop.MORE, {
            text: fastFoods[fastfoodIndex]
          });
        })

        function updateFastFoodCount() {
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

        dinnerGroup.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        const dinnerText = dinnerGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 200,
          w: fullWidth,
          h: 100,
          align_h: hmUI.align.CENTER_H,
          text_size: 32,
          color: gold,
          text: '水煮鱼'
        })

        const dinnerCount = dinnerGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 250,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          text_size: smallFont,
          color: lightText,
          text: '还没选过'
        })

        const dinnerSelect = dinnerGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 350,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          text_size: 24,
          color: lightText,
          text: '选择'
        })

        dinnerGroup.createWidget(hmUI.widget.BUTTON, {
          x: 60,
          y: 350,
          w: 72,
          h: 50,
          text: '选择',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: smallFont,
          radius: 15,
          click_func: () => {
            if (pages[pages.length - 1] != "dinner") {
              return
            }
            if (dinnerIndex == -1) {
              return
            }
            if (typeof (dinnersStat[dinnerIndex + '']) == 'undefined') {
              dinnersStat[dinnerIndex + ''] = 0;
            } else {
              dinnersStat[dinnerIndex + '']++;
            }
            updateDinnerCount()
          }
        })
        


        var dinnerIndex = 1;
        const refreshDinner = dinnerGroup.createWidget(hmUI.widget.IMG, { //小程序图标
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "refresh.png"
        })

        refreshDinner.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "dinner") {
            return
          }
          dinnerIndex = Math.round(Math.random() * dinners.length)
          updateDinnerCount()
          dinnerText.setProperty(hmUI.prop.MORE, {
            text: dinners[dinnerIndex]
          });
        })


        function updateDinnerCount() {
          dinnerCount.setProperty(hmUI.prop.MORE, {
            text: dinnersStat[dinnerIndex + ''] ? '已选' + dinnersStat[dinnerIndex + ''] + '次' : '还没选过'
          });
        }

        function gotoFastfood() {
          if (pages[pages.length - 1] != "app4") {
            return
          }
          goin(fastfoodGroup)
          pages.push('fastfood')
        }

        function gotoDinner() {
          if (pages[pages.length - 1] != "app4") {
            return
          }
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

        app5Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        app5Group.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 80,
          w: fullWidth - 10,
          h: 32,
          text: '增强版表盘',
          text_size: titleFont,
          color: lightText,

          text_style: hmUI.text_style.NONE
        })

        app5Group.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 110,
          w: fullWidth - 10,
          h: 24,
          text: '开发者：梁小蜗',
          text_size: smallFont,
          color: orange,
          text_style: hmUI.text_style.WRAP
        })

        app5Group.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 140,
          w: fullWidth - 10,
          h: 80,
          text: '这是免费开源软件，如果您付费了，请联系卖家退款',
          align_h: hmUI.align.LEFT,
          text_size: smallFont,
          color: lightText,
          text_style: hmUI.text_style.WRAP
        })

       

        const logNav = app5Group.createWidget(hmUI.widget.IMG, {
          x: 5,
          y: 250,
          w: fullWidth - 10,
          h: 200,
          src: 'qr.png'
        })

        const logBg = app5Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        let logStr = 'log:'

        const logs = app5Group.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 80,
          w: fullWidth - 10,
          h: fullHeight - 80,
          text: 'log:',
          align_h: hmUI.align.LEFT,
          text_size: tinyFont,
          color: lightText,
          text_style: hmUI.text_style.WRAP
        })

        logBg.setProperty(hmUI.prop.VISIBLE, false)
        logs.setProperty(hmUI.prop.VISIBLE, false)

        logNav.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app5") {
            return
          }
          logBg.setProperty(hmUI.prop.VISIBLE, true)
          logs.setProperty(hmUI.prop.VISIBLE, true)
        })
        logs.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app5") {
            return
          }
          logBg.setProperty(hmUI.prop.VISIBLE, false)
          logs.setProperty(hmUI.prop.VISIBLE, false)
        })

        function pushLog(log) {
          logStr += log
          if (logStr.length > 150) {
            logStr = logStr.substring(logStr.length - 150, 150)
          }
          logs.setProperty(hmUI.prop.MORE, {
            text: logStr
          })
        }

        function pushLog(log){
          logStr += log
          if(logStr.length > 150){
            logStr = logStr.substring(logStr.length - 150,150)
          }
          logs.setProperty(hmUI.prop.MORE, {
            text: logStr
          })
        }

        //--------------------------------尺子-------------------------------------
        let app6Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app5Group, false)

        app6Group.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          src: 'ruler.png'
        })

        setGroupVisible(app6Group, false)

        //--------------------------------输入框-------------------------------------
        var inputTarget = null;
        var inputStr = '';
        var inputCode = '';

        let inputGroup = hmUI.createWidget(hmUI.widget.GROUP,{
          x:0,
          y:0,
          w: fullWidth,
          h:fullHeight
        })
        
        

        inputGroup.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 94,
          w: fullWidth,
          h: 84,
          radius: 15,
          color: btnPress
        })

        let inputBox = inputGroup.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 96,
          w: fullWidth - 10,
          h: 80,
          text: '',
          text_size: smallFont,
          line_space: 2,
          color: lightText,
          text_style: hmUI.text_style.WRAP
        })

        let inputCodeBox = inputGroup.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 220,
          w: fullWidth - 10,
          h: 24,
          text: '',
          text_size: smallFont,
          line_space: 2,
          color: lightText,
          text_style: hmUI.text_style.WRAP
        })

        

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: 2,
          y: 250,
          text: '0',
          w: (fullWidth - 6) / 2,
          h: 66,
          radius:5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => { inputCodeX('0')}
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: (fullWidth - 6) / 2 + 4,
          y: 250,
          text: '1',
          w: (fullWidth - 6) / 2,
          h: 66,
          radius: 5,
          text_size:titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => { inputCodeX('1')}
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: 2,
          y: 320,
          text: '2',
          w: (fullWidth - 6) / 2,
          h: 66,
          radius: 5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => { inputCodeX('2') }
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: (fullWidth - 6) / 2 + 4,
          y: 320,
          text: '3',
          w: (fullWidth - 6) / 2,
          h: 66,
          radius: 5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => { inputCodeX('3') }
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: fullWidth / 3,
          y: 390,
          text: '←',
          w: fullWidth / 3,
          h: 66,
          radius: 5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => { backSpace() }
        })

        function inputCodeX(n){
          if(inputCode.length > 3){
            inputCode = '';
          }else{
            inputCode += '' + n;
            if(inputCode.length == 4){
              if (ks[inputCode] != undefined){
                inputStr += ks[inputCode];
                updateInputBox()
              }
              inputCode = ''
            }
          }
          inputCodeBox.setProperty(hmUI.prop.MORE, {
            text: inputCode
          })
        }

        function updateInputBox(){
          inputBox.setProperty(hmUI.prop.MORE, {
            text: inputStr
          })
        }

        function backSpace(){
          if(inputCode.length > 0){
            inputCode = inputCode.substring(0,inputCode.length-1)
            inputCodeBox.setProperty(hmUI.prop.MORE, {
              text: inputCode
            })
          }else{
            if(inputStr.length > 0){
              inputStr = inputStr.substring(0, inputStr.length - 1)
              updateInputBox()
            }
          }
        }

        setGroupVisible(inputGroup, false)

        //--------------------------------通用功能-------------------------------------

        function openApp(i){
          if (pages[pages.length - 1] != "menu") {return}
          switch(i){
            case 1:
              goin(app1Group)
              break;
            case 2:
              goin(app2Group)
              break;
            case 3:
              goin(app3Group)
              break;
            case 4:
              goin(app4Group)
              break;
            case 5:
              goin(app5Group)
              break;
            case 6:
              goin(app6Group)
              break;
            default:
              return
          }
          pages.push("app" + i)
        }

        function goback() { //返回上一层
          if (pages.length > 1) {
            var page = pages.pop()
            if (page == 'edit'){
              setGroupVisible(inputGroup, false)
              if(inputTarget == 'wechat'){
                wechatCode = inputStr
                updateWechatCode()
              }
              if (inputTarget == 'alipay') {
                alipayCode = inputStr
                updateAlipayCode()
              }
              setMaxBright()
            }
            if (page == 'app1' || page == 'app2'){
              resetBright()
            }
          }
          if (views.length <= 0) {
            switchUI(true)
            return
          }
          var ui = views.pop();
          //if (ui.type == 'GROUP') {
            setGroupVisible(ui, false)
          //}
        }

        function setGroupVisible(ui, v) {
          ui.setProperty(hmUI.prop.VISIBLE, v);
          // ui.subWds.forEach(element => {
          //   element.setProperty(hmUI.prop.VISIBLE, v);
          // });
        }

        let isAutoBright
        let bright

        function goin(ui) {
          views.push(ui);
          if (ui == app1Group || ui == app2Group ){
            checkBright()
            setMaxBright()
          }
          setGroupVisible(ui, true);
        }
        
        //检查亮度设置
        function checkBright(){
          try {
            isAutoBright = hmSetting.getScreenAutoBright()
            if (!isAutoBright) {
              bright = hmSetting.getBrightness()
            }
          } catch (e) { }
        }

        function setMaxBright(){
          try {
            hmSetting.setScreenAutoBright(false)
            hmSetting.setBrightness(100)
          } catch (e) {

          }
        }

        //重置亮度
        function resetBright(){
          try {
            if(isAutoBright){
              hmSetting.setScreenAutoBright()
            }else{
              hmSetting.setBrightness(bright)
            }
          } catch (e) { }
        }

        pushLog('V1.0\n')

        const backBUtton = hmUI.createWidget(hmUI.widget.IMG, { //返回按键
          x: (fullWidth - iconBtnW) / 2,
          y: topBtnY,
          src: "back.png",
        })
        backBUtton.setProperty(hmUI.prop.VISIBLE, false);
        backBUtton.addEventListener(hmUI.event.CLICK_DOWN, function (info) {goback();})

        //updateWechatCode()
        //updateAlipayCode()

        var ks = {
          '0200': ' ',
          '0201': '!',
          '0202': '"',
          '0203': '#',
          '0210': '$',
          '0211': '%',
          '0212': '&',
          '0213': '\'',
          '0220': '\(',
          '0221': ')',
          '0222': '*',
          '0223': '+',
          '0230': ',',
          '0231': '-',
          '0232': '.',
          '0233': '/',
          '0300': '0',
          '0301': '1',
          '0302': '2',
          '0303': '3',
          '0310': '4',
          '0311': '5',
          '0312': '6',
          '0313': '7',
          '0320': '8',
          '0321': '9',
          '0322': ':',
          '0323': ';',
          '0330': '<',
          '0331': '=',
          '0332': '>',
          '0333': '?',
          '1000': '@',
          '1001': 'A',
          '1002': 'B',
          '1003': 'C',
          '1010': 'D',
          '1011': 'E',
          '1012': 'F',
          '1013': 'G',
          '1020': 'H',
          '1021': 'I',
          '1022': 'J',
          '1023': 'K',
          '1030': 'L',
          '1031': 'M',
          '1032': 'N',
          '1033': 'O',
          '1100': 'P',
          '1101': 'Q',
          '1102': 'R',
          '1103': 'S',
          '1110': 'T',
          '1111': 'U',
          '1112': 'V',
          '1113': 'W',
          '1120': 'X',
          '1121': 'Y',
          '1122': 'Z',
          '1123': '[',
          '1130': '\\',
          '1131': ']',
          '1132': '^',
          '1133': '_',
          '1200': '`',
          '1201': 'a',
          '1202': 'b',
          '1203': 'c',
          '1210': 'd',
          '1211': 'e',
          '1212': 'f',
          '1213': 'g',
          '1220': 'h',
          '1221': 'i',
          '1222': 'j',
          '1223': 'k',
          '1230': 'l',
          '1231': 'm',
          '1232': 'n',
          '1233': 'o',
          '1300': 'p',
          '1301': 'q',
          '1302': 'r',
          '1303': 's',
          '1310': 't',
          '1311': 'u',
          '1312': 'v',
          '1313': 'w',
          '1320': 'x',
          '1321': 'y',
          '1322': 'z',
          '1323': '{',
          '1330': '|',
          '1331': '}',
          '1332': '~',
        }
      },
      onInit() {
        p.log("index page.js on init invoke");
      },
      build() {
        this.init_view(), p.log("index page.js on ready invoke");
      },
      onDestory() {
        p.log("index page.js on destory invoke");
        try {
          timer.stopTimer(mainTimer)
        } catch (e) {}
      }
    });
  })();
} catch (n) {
  console.log(n);
}