/*
 This file is part of Monoeci Ninja.
 https://github.com/Yoyae/monoecininja-fe

 Monoeci Ninja is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Monoeci Ninja is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Monoeci Ninja.  If not, see <http://www.gnu.org/licenses/>.

 */

// Monoeci Ninja Front-End (monoecininja-fe) - Budget Details

var monoecininjaversion = '1.2.3';
var tableVotes = null;
var tableSuperBlocks = null;
var monoecioutputregexp = /^[a-z0-9]{64}-[0-9]+$/;
var monoecibudgetregexp = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890 .,;_\-/:?@()]+$/;
var budgetid = '';
var budgethash = '';
var latestblock = null;
var currentbudget = null;
var currentbudgetprojection = null;
var currentstats = null;

$.fn.dataTable.ext.errMode = 'throw';

if (typeof monoecininjatestnet === 'undefined') {
  var monoecininjatestnet = 0;
}
if (typeof monoecininjatestnethost !== 'undefined') {
  if (window.location.hostname == monoecininjatestnethost) {
    monoecininjatestnet = 1;
    $('a[name=menuitemexplorer]').attr("href", "https://"+monoecininjatestnetexplorer);
  }
}

if (typeof monoecininjacoin === 'undefined') {
  var monoecininjacoin = ['',''];
}
if (typeof monoecininjaaddressexplorer === 'undefined') {
  var monoecininjaaddressexplorer = [[],[]];
}
if (typeof monoecininjaaddressexplorer[0] === 'undefined') {
  monoecininjaaddressexplorer[0] = [];
}
if (typeof monoecininjaaddressexplorer[1] === 'undefined') {
  monoecininjaaddressexplorer[1] = [];
}

if (typeof monoecininjamndetailvin === 'undefined') {
    var monoecininjamndetailvin = [[],[]];
}
if (typeof monoecininjamndetailvin[0] === 'undefined') {
    monoecininjamndetailvin[0] = [];
}
if (typeof monoecininjamndetailvin[1] === 'undefined') {
    monoecininjamndetailvin[1] = [];
}

if (typeof monoecininjaaddressexplorer === 'undefined') {
    var monoecininjaaddressexplorer = [[],[]];
}
if (typeof monoecininjaaddressexplorer[0] === 'undefined') {
    monoecininjaaddressexplorer[0] = [];
}
if (typeof monoecininjaaddressexplorer[1] === 'undefined') {
    monoecininjaaddressexplorer[1] = [];
}

if (typeof monoecininjatxexplorer === 'undefined') {
    var monoecininjatxexplorer = [[],[]];
}
if (typeof monoecininjatxexplorer[0] === 'undefined') {
    monoecininjatxexplorer[0] = [];
}
if (typeof monoecininjatxexplorer[1] === 'undefined') {
    monoecininjatxexplorer[1] = [];
}

function budgetdetailsRefresh(useHash){
  console.log("DEBUG: budgetdetailsRefresh starting");
  $('#budgetinfoLR').html( '<i class="fa fa-spinner fa-pulse"></i> Refreshing <i class="fa fa-spinner fa-pulse"></i>' );
  var query = '/api/budgets?testnet='+monoecininjatestnet;
  if (useHash) {
    query += '&budgethashes=["'+encodeURIComponent(budgethash)+'"]';
  }
  else {
    query += '&budgetids=["'+encodeURIComponent(budgetid)+'"]';
  }
    console.log("DEBUG: REST query="+query);
  $.getJSON( query, function( data ) {
   var date = new Date();
   var n = date.toDateString();
   var time = date.toLocaleTimeString();
   var result = "";

   console.log("DEBUG: REST api /budgets query responded!");

   if ((!data.hasOwnProperty("data")) || (!data.data.hasOwnProperty("budgets")) || (!Array.isArray(data.data.budgets)) || (data.data.budgets.length == 0)) {
       result = 'Unknown budget';
    $('#budgetid').text(result+" ("+budgetid+")");
    $('#budgethash').text(result+" ("+budgethash+")");
       $('#budgethash1').text("???");
       $('#budgethash2').text("???");
       $('#budgethash3').text("???");
       $('#budgethash4').text("???");
       $('#budgetfee').text(result);
       $('#budgeturl').text(result);
    $('#budgetblockstart').text(result);
    $('#budgetblockend').text(result);
    $('#budgetmonthlyamount').text(result);
    $('#budgettotalamount').text(result);
    $('#budgetremainingpayments').text(result);
    $('#budgettotalpayments').text(result);
    $('#budgetpubkey').text(result);
    $('#budgetstatus').text(result);
       $('#budgetlastpaid').text(result);
       $('#budgetyes').text(result);
       $('#budgetno').text(result);
       $('#budgetyesremaining').text(result);
       $('#budgetlastseen').text(result);
       $('#budgetfirstseen').text(result);
   }
   else {

       currentbudget = data.data.budgets[0];
       currentstats = data.data.stats;
       $('#budgetid').text( data.data.budgets[0].ID );
       $('#budgethash').text( data.data.budgets[0].Hash );
       $('#budgethash1').text( data.data.budgets[0].Hash );
       $('#budgethash2').text( data.data.budgets[0].Hash );
       $('#budgethash3').text( data.data.budgets[0].Hash );
       $('#budgethash4').text( data.data.budgets[0].Hash );

       var outtxt = "";
       if (monoecininjatxexplorer[monoecininjatestnet].length > 0) {
           var ix = 0;
           for ( var i=0, ien=monoecininjatxexplorer[monoecininjatestnet].length ; i<ien ; i++ ) {
               if (ix == 0) {
                   outtxt += '<a href="'+monoecininjatxexplorer[monoecininjatestnet][0][0].replace('%%a%%',data.data.budgets[0].FeeHash)+'">'+data.data.budgets[0].FeeHash+'</a>';
               }
               else {
                   outtxt += '<a href="'+monoecininjatxexplorer[monoecininjatestnet][i][0].replace('%%a%%',data.data.budgets[0].FeeHash)+'">['+ix+']</a>';
               }
               ix++;
           }
       }
       else {
           outtxt = data.data.budgets[0].FeeHash;
       }
       $('#budgetfee').html( outtxt );

       var url = data.data.budgets[0].URL;
       if (url.indexOf("://") == -1) {
           url = "http://"+url;
       }
       $('#budgeturl').html( '<a href="'+url+'">'+data.data.budgets[0].URL+'</a>' );
       $('#budgetblockstart').text( data.data.budgets[0].BlockStart );
       $('#budgetblockend').text( data.data.budgets[0].BlockEnd );
       $('#budgetmonthlyamount').html( addCommas( data.data.budgets[0].MonthlyPayment.toFixed(3) )+' '+monoecininjacoin[monoecininjatestnet] + ' (<span id="budgetmonthlyamountusd">???</span> USD) (<span id="budgetmonthlyamounteur">???</span> EUR)');
       $('#budgettotalamount').html( addCommas( data.data.budgets[0].TotalPayment.toFixed(3) )+' '+monoecininjacoin[monoecininjatestnet] + ' (<span id="budgettotalamountusd">???</span> USD) (<span id="budgettotalamounteur">???</span> EUR)' );
       $('#budgettotalpayments').text( data.data.budgets[0].TotalPaymentCount );
       $('#budgetremainingpayments').text( data.data.budgets[0].RemainingPaymentCount );
       $('#budgetyes').text( data.data.budgets[0].Yeas );
       $('#budgetno').text( data.data.budgets[0].Nays );

       outtxt = "";
           if (monoecininjaaddressexplorer[monoecininjatestnet].length > 0) {
               var ix = 0;
               for ( var i=0, ien=monoecininjaaddressexplorer[monoecininjatestnet].length ; i<ien ; i++ ) {
                   if (ix == 0) {
                       outtxt += '<a href="'+monoecininjaaddressexplorer[monoecininjatestnet][0][0].replace('%%a%%',data.data.budgets[0].PaymentAddress)+'">'+data.data.budgets[0].PaymentAddress+'</a>';
                   }
                   else {
                       outtxt += '<a href="'+monoecininjaaddressexplorer[monoecininjatestnet][i][0].replace('%%a%%',data.data.budgets[0].PaymentAddress)+'">['+ix+']</a>';
                   }
                   ix++;
               }
           }
           else {
               outtxt = data.data.budgets[0].PaymentAddress;
           }
       $('#budgetpubkey').html( outtxt );

       var mnLimit = Math.floor(data.data.stats.totalmns * 0.1);
       var curPositive = data.data.budgets[0].Yeas - data.data.budgets[0].Nays;
       var cls = "danger";
       if (curPositive < mnLimit) {
           $('#budgetyesremaining').text( "Need "+(mnLimit-curPositive)+" YES votes" );
       }
       else {
           $('#budgetyesremaining').text( "Already exceed 10% by "+(curPositive-mnLimit)+" YES votes" );
           cls = "success";
       }
       $('#budgetyesremaining').removeClass("danger").removeClass("success").addClass(cls);

       var result = "";
       if (data.data.budgets[0].LastReported > 0) {
           result = deltaTimeStampHRlong(data.data.budgets[0].LastReported,currenttimestamp())+" ago";
       }
       else {
           result = 'Just now ('+data.data.budgets[0].LastReported+')';
       }
       var dateConv = new Date(data.data.budgets[0].LastReported*1000);
       $('#budgetlastseen').text( result+' ['+dateConv.toLocaleDateString()+' '+dateConv.toLocaleTimeString()+']' );
       $('#budgetlastseen2').text( dateConv.toLocaleString()+' ('+result+')' );
       var result = "";
       if (data.data.budgets[0].FirstReported > 0) {
           result = deltaTimeStampHRlong(data.data.budgets[0].FirstReported,currenttimestamp())+" ago";
       }
       else {
           result = 'Just now ('+data.data.budgets[0].FirstReported+')';
       }
       var dateConv = new Date(data.data.budgets[0].FirstReported*1000);
       $('#budgetfirstseen').text( result+' ['+dateConv.toLocaleDateString()+' '+dateConv.toLocaleTimeString()+']' );

       result = "";
       cls = "";
       var checkBP = false;
       if ((currenttimestamp() - data.data.budgets[0].LastReported) > 3600) {
           result = "Unlisted/Dropped";
           cls = "danger";
           $('#voteisover').show();
           $('#voteisover2').hide();
           $('#voteyes').hide();
           $('#voteno').hide();
       }
       else {
           if (data.data.budgets[0].IsEstablished) {
               if (data.data.budgets[0].IsValid) {
                   result = 'Valid, Established and <i class="fa fa-spinner fa-pulse"></i>';
                   cls = "success";
                   checkBP = true;
               }
               else {
                   result = "Invalid ("+data.data.budgets[0].IsValidReason+")";
                   cls = "warning";
               }
           }
           else {
               if (data.data.budgets[0].IsValid) {
                   result = "Valid (Waiting for 24 hours to be established)";
                   cls = "warning";
               }
               else {
                   result = "Invalid ("+data.data.budgets[0].IsValidReason+")";
                   cls = "danger";
               }
           }
           $('#voteisover').hide();
           $('#voteisover2').hide();
           $('#voteyes').show();
           $('#voteno').show();
       }
       $('#budgetstatus').html(result).removeClass("danger").removeClass("success").removeClass("warning").addClass(cls);;

       if (tableVotes !== null) {
           tableVotes.api().ajax.reload();
       }
       else {
           tableVotes = $('#votestable').dataTable({
               ajax: {
                   url: '/api/budgets/votes?testnet=' + monoecininjatestnet + '&budgetid=' + encodeURIComponent(budgetid) + '&onlyvalid=1',
                   dataSrc: 'data.budgetsvotes'
               },
               lengthMenu: [[50, 100, 250, 500, -1], [50, 100, 250, 500, "All"]],
               pageLength: 50,
               order: [[0, "desc"]],
               columns: [
                   {
                       data: null, render: function (data, type, row) {
                       var date = new Date(data.VoteTime * 1000);
                       if (type == 'sort') {
                           return date;
                       }
                       else {
                           return date.toLocaleDateString() + " " + date.toLocaleTimeString();
                       }
                   }
                   },
                   {
                       data: null, render: function (data, type, row) {
                       var outtxt = '';
                       if (type != 'sort') {
                           if ((monoecininjamndetailvin[monoecininjatestnet].length > 0) || (monoecininjatxexplorer[monoecininjatestnet].length > 0)) {
                               var ix = 0;
                               for (var i = 0, ien = monoecininjamndetailvin[monoecininjatestnet].length; i < ien; i++) {
                                   if (ix == 0) {
                                       outtxt += '<a href="' + monoecininjamndetailvin[monoecininjatestnet][0][0].replace('%%a%%', data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex) + '">' + data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex + '</a>';
                                   }
                                   else {
                                       outtxt += '<a href="' + monoecininjamndetailvin[monoecininjatestnet][i][0].replace('%%a%%', data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex) + '">[' + ix + ']</a>';
                                   }
                                   ix++;
                               }
                               for (var i = 0, ien = monoecininjatxexplorer[monoecininjatestnet].length; i < ien; i++) {
                                   if (ix == 0) {
                                       outtxt += '<a href="' + monoecininjatxexplorer[monoecininjatestnet][0][0].replace('%%a%%', data.MasternodeOutputHash) + '">' + data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex + '</a>';
                                   }
                                   else {
                                       outtxt += '<a href="' + monoecininjatxexplorer[monoecininjatestnet][i][0].replace('%%a%%', data.MasternodeOutputHash) + '">[' + ix + ']</a>';
                                   }
                                   ix++;
                               }
                           }
                           else {
                               outtxt = data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex;
                           }
                       }
                       else {
                           outtxt = data.MasternodeOutputHash + '-' + data.MasternodeOutputIndex;
                       }
                       return outtxt;
                   }
                   },
                   {data: "VoteValue"},
                   {
                       data: null, render: function (data, type, row) {
                       if (type == 'sort') {
                           return data.VoteHash;
                       }
                       else {
                           return '<span data-toggle="tooltip" title="' + data.VoteHash + '">' + data.VoteHash.substring(0, 7) + '</span>';
                       }
                   }
                   }
               ],
               createdRow: function (row, data, index) {
                   if (data.VoteValue == "YES") {
                       $('td', row).eq(2).css({"background-color": "#d6e9c6", "color": "#3c763d"});
                   }
                   else {
                       $('td', row).eq(2).css({"background-color": "#f2dede", "color": "#a94442"});
                   }
               }
           });
       }

       $('#budgetlastpaid').html( '<i class="fa fa-spinner fa-pulse"></i> Calculating... <i class="fa fa-spinner fa-pulse"></i>' );
       if (tableSuperBlocks !== null) {
           tableSuperBlocks.api().ajax.reload();
       }
       else {
           tableSuperBlocks = $('#superblockstable').dataTable({
               ajax: {
                   url: '/api/blocks?testnet=' + monoecininjatestnet + '&budgetids=["' + encodeURIComponent(budgetid) + '"]&onlysuperblocks=1',
                   dataSrc: 'data.blocks'
               },
               lengthMenu: [[50, 100, 250, 500, -1], [50, 100, 250, 500, "All"]],
               pageLength: 50,
               order: [[0, "desc"]],
               columns: [
                   {
                       data: null, render: function (data, type, row) {
                       if (type == 'sort') {
                           return data.BlockTime;
                       }
                       else {
//                return deltaTimeStampHR(currenttimestamp(),data.BlockTime);
                           return timeSince((currenttimestamp() - data.BlockTime));
                       }

                   }
                   },
                   {
                       data: null, render: function (data, type, row) {
                       var outtxt = data.BlockId;
                       if (type != 'sort') {
                           if (monoecininjablockexplorer[monoecininjatestnet].length > 0) {
                               outtxt = '<a href="' + monoecininjablockexplorer[monoecininjatestnet][0][0].replace('%%b%%', data.BlockHash) + '">' + data.BlockId + '</a>';
                           }
                       }
                       return outtxt;
                   }
                   },
                   {
                       data: null, render: function (data, type, row) {
                       var outtxt = data.BlockPoolPubKey;
                       if (data.PoolDescription) {
                           outtxt = data.PoolDescription;
                       }
                       return outtxt;
                   }
                   },
                   {data: "BlockDifficulty"},
                   {
                       data: null, render: function (data, type, row) {
                       if (type == "sort") {
                           return data.BlockMNValue;
                       } else {
                           return addCommas(data.BlockMNValue.toFixed(3)) + " " + monoecininjacoin[monoecininjatestnet];
                       }
                   }
                   }
               ],
               createdRow: function (row, data, index) {
               }
           });
       }
  }

   $('#budgetinfoLR').text( date.toLocaleString() );
      refreshFiatValues();
      if (checkBP) {
          refreshBudgetProjection(useHash);
      }
   console.log("DEBUG: auto-refresh starting");
   setTimeout(budgetdetailsRefresh, 300000);
  });
};

function refreshBudgetProjection(useHash) {
    console.log("DEBUG: refreshBudgetProjection starting");
    var query = '/api/budgetsprojection?testnet=' + monoecininjatestnet+'&onlyvalid=1';
    if (useHash) {
        query += '&budgethashes=["' + encodeURIComponent(budgethash) + '"]';
    }
    else {
        query += '&budgetids=["' + encodeURIComponent(budgetid) + '"]';
    }
    console.log("DEBUG: REST query=" + query);
    $.getJSON(query, function (data) {
        console.log("DEBUG: REST api /budgetsprojection query responded!");

        if ((data.hasOwnProperty("data")) && (data.data.hasOwnProperty("budgetsprojection")) && (Array.isArray(data.data.budgetsprojection)) && (data.data.budgetsprojection.length == 1) &&
            ((currenttimestamp() - data.data.budgetsprojection[0].LastReported) < 3600)) {
            $('#budgetstatus').html("Valid, Established and Alloted (" + addCommas(data.data.budgetsprojection[0].Alloted.toFixed(3)) + " " + monoecininjacoin[monoecininjatestnet] + ")");
        }
        else {
            $('#budgetstatus').html("Valid and Established");
        }
    });
}

function refreshFiatValues() {

    if (currentbudget !== null) {
        $('#fiatXMCCBTCval').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatXMCCBTCwho').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatXMCCBTCwhen').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatUSDBTCval').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatUSDBTCwho').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatUSDBTCwhen').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatEURBTCval').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatEURBTCwho').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#fiatEURBTCwhen').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#budgetmonthlyamountusd').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#budgetmonthlyamounteur').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#budgettotalamountusd').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        $('#budgettotalamounteur').html( '<i class="fa fa-spinner fa-pulse"></i>' );
        var query = '/api/tablevars';
        $.getJSON( query, function( data ) {
            console.log("DEBUG: REST api /tablevars query reply!");
            if ((!data.hasOwnProperty("data")) || (!data.data.hasOwnProperty("tablevars")) || (data.data.tablevars === null)
            || (!data.data.tablevars.hasOwnProperty("btcdrk")) || (!data.data.tablevars.hasOwnProperty("eurobtc"))
            || (!data.data.tablevars.hasOwnProperty("usdbtc"))) {
                $('#fiatXMCCBTCval').text( '???' );
                $('#fiatXMCCBTCwho').text( '???' );
                $('#fiatXMCCBTCwhen').text( '???' );
                $('#fiatUSDBTCval').text( '???' );
                $('#fiatUSDBTCwho').text( '???' );
                $('#fiatUSDBTCwhen').text( '???' );
                $('#fiatEURBTCval').text( '???' );
                $('#fiatEURBTCwho').text( '???' );
                $('#fiatEURBTCwhen').text( '???' );
                $('#budgetmonthlyamountusd').text( '???' );
                $('#budgetmonthlyamounteur').text( '???' );
                $('#budgettotalamountusd').text( '???' );
                $('#budgettotalamounteur').text( '???' );
            }
            else {
                $('#fiatXMCCBTCval').text( data.data.tablevars.btcdrk.StatValue );
                $('#fiatXMCCBTCwho').text( data.data.tablevars.btcdrk.Source );
                var tmpDate = new Date(parseInt(data.data.tablevars.btcdrk.LastUpdate)*1000);
                $('#fiatXMCCBTCwhen').text( tmpDate.toLocaleString() );
                $('#fiatUSDBTCval').text( data.data.tablevars.usdbtc.StatValue );
                $('#fiatUSDBTCwho').text( data.data.tablevars.usdbtc.Source );
                tmpDate = new Date(parseInt(data.data.tablevars.usdbtc.LastUpdate)*1000);
                $('#fiatUSDBTCwhen').text( tmpDate.toLocaleString() );
                $('#fiatEURBTCval').text( data.data.tablevars.eurobtc.StatValue );
                $('#fiatEURBTCwho').text( data.data.tablevars.eurobtc.Source );
                tmpDate = new Date(parseInt(data.data.tablevars.eurobtc.LastUpdate)*1000);
                $('#fiatEURBTCwhen').text( tmpDate.toLocaleString() );

                var valBTC = currentbudget.MonthlyPayment * parseFloat(data.data.tablevars.btcdrk.StatValue);
                var valUSD = valBTC * parseFloat(data.data.tablevars.usdbtc.StatValue);
                var valEUR = valBTC * parseFloat(data.data.tablevars.eurobtc.StatValue);
                $('#budgetmonthlyamountusd').text( addCommas(valUSD.toFixed(2)) );
                $('#budgetmonthlyamounteur').text( addCommas(valEUR.toFixed(2)) );

                valBTC = currentbudget.TotalPayment * parseFloat(data.data.tablevars.btcdrk.StatValue);
                valUSD = valBTC * parseFloat(data.data.tablevars.usdbtc.StatValue);
                valEUR = valBTC * parseFloat(data.data.tablevars.eurobtc.StatValue);
                $('#budgettotalamountusd').text( addCommas(valUSD.toFixed(2)) );
                $('#budgettotalamounteur').text( addCommas(valEUR.toFixed(2)) );

            }
        });
    }

}

$(document).ready(function(){

  $('#monoecininjajsversion').text( monoecininjaversion );

  if (monoecininjatestnet == 1) {
      $('#testnetalert').show();
  }

  budgetid = getParameter("budgetid");
  console.log("DEBUG: budgetid="+budgetid);
  budgethash = getParameter("budgethash");
  console.log("DEBUG: budgethash="+budgethash);

  if ((budgetid == "") && (budgethash == "")) {
      budgetid = 'Need "budgetid" parameter';
      $('#budgetid').text(mnpubkey);
      budgethash = 'Need "budgethash" parameter';
      $('#budgethash').text(mnvin);
  }
  else {
    if ((budgetid != "") && (budgethash == "")) {
      if (!monoecibudgetregexp.test(budgetid)) {
          budgetid = 'Invalid';
          $('#budgetid').text(budgetid);
      }
      else {
          budgetdetailsRefresh(false);
      }
    }
    else {
      if (!monoecioutputregexp.test(budgethash)) {
          budgethash = 'Invalid';
          $('#budgethash').text( budgethash );
      }
      else {
          budgetdetailsRefresh(true);
      }
    }
  }

  $('#votestable').on('xhr.dt', function ( e, settings, json ) {
        // Change the last refresh date
        var date = new Date();
        $('#votestableLR').text( date.toLocaleString() );
      } );

    $('#superblockstable').on('xhr.dt', function ( e, settings, json ) {
        latestblock = {BlockTime: 0, BlockId: -1};
        // Fill per version stats table
        var numblocks = 0;
        for (var blockid in json.data.blocks){
            if(!json.data.blocks.hasOwnProperty(blockid)) {continue;}
            numblocks++;
            if (json.data.blocks[blockid].BlockTime > latestblock.BlockTime) {
                latestblock = json.data.blocks[blockid];
            }
        }

        var outtxt = (currentbudget.TotalPaymentCount-numblocks);
        var cls = "danger";

        if ((currentbudget.TotalPaymentCount-numblocks) > 0) {
            outtxt += " - ";
            if ((currenttimestamp() - currentbudget.LastReported) > 3600) {
                outtxt += "Won't get future payments (unlisted)";
            }
            else {
                var mnLimit = Math.floor(currentstats.totalmns * 0.1);
                var curPositive = currentbudget.Yeas - currentbudget.Nays;
                var nextsuperblockdatetimestamp = currentstats.latestblock.BlockTime + (((currentstats.nextsuperblock.blockheight - currentstats.latestblock.BlockId) / 553) * 86400);
                var datesuperblock = new Date(nextsuperblockdatetimestamp * 1000);
                if (curPositive > mnLimit) {
                    outtxt += "Next payment at super-block ";
                }
                else {
                    outtxt += "Next possible super-block ";
                }
                outtxt += +currentstats.nextsuperblock.blockheight + " (est. " + datesuperblock.toLocaleString() + ", " + deltaTimeStampHRlong(nextsuperblockdatetimestamp, currenttimestamp()) + " from now)";
                $('#voteisover').hide();
                $('#voteisover2').hide();
                $('#voteyes').show();
                $('#voteno').show();
            }
        }
        else {
            $('#voteisover').hide();
            $('#voteisover2').show();
            $('#voteyes').hide();
            $('#voteno').hide();
        }
        $('#budgetremainingpayments').text( outtxt );

        outtxt = "";
        cls = "danger";
        if (latestblock.BlockId == -1) {
            outtxt = "Never";
        }
        else {
            if (monoecininjablockexplorer[monoecininjatestnet].length > 0) {
                outtxt = 'Block <a href="' + monoecininjablockexplorer[monoecininjatestnet][0][0].replace('%%b%%', latestblock.BlockHash) + '">' + latestblock.BlockId + '</a>';
            }
            var tmpDate = new Date(latestblock.BlockTime * 1000);
            outtxt += " on " + tmpDate.toLocaleString() + " (" + timeSince((currenttimestamp() - latestblock.BlockTime)) + ")";
            cls = "success";
        }

        $('#budgetlastpaid').html( outtxt ).removeClass("danger").removeClass("success").addClass(cls);
        $('#budgetlastpaid2').html( outtxt );

        // Change the last refresh date
        var date = new Date();
        $('#superblockstableLR').text( date.toLocaleString() );
    } );

});
