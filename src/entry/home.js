/**
 * @file 主页代码
 * @author Shi-Liang(385936547@qq.com)
 */

'use strict';


import $ from 'jquery';
import '../less/home.less';


$(document).ready(function () {
    let numberTransfer = function (number) {
        return (number + '').replace(/(\d+?)(?=(?:\d{3})+$)/g, '$1,');
    };
    $.ajax({
        url: 'https://api.github.com/repos/PaddlePaddle/Paddle',
        dataType: 'json',
        crossDomain: true,
        success: function initGitStat(res) {
            $('#star-counter').html(numberTransfer(res.stargazers_count));
            $('#fork-counter').html(numberTransfer(res.forks_count));
        }
    });
});