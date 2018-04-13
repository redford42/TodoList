;(function () {

    'use strict';
    var $form_add_task = $('#btn_add')
        , task_list = {}
        ;



    /*声明一下开机启动函数*/
    init();

    /*渲染【.task_list】的函数*/
    function render_task_list() {
        var $task_list = $('.tasks-list');
        $task_list.html('');
        for(var i = 0;i<task_list.length;i++){
            var $task = render_task_tpl(task_list[i]);
            $task_list.append($task);
        }
    }
    /*上面那个函数要用的模板*/
    function render_task_tpl(data) {
        var list_item_tpl =
            '<div class="task-item">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="fr">' +
            '<span class="action"> 删除</span>' +
            '<span class="action"> 详细</span>' +
            '</span>' +
            '</div>';
        return $(list_item_tpl);
    }

    /*添加Task的动作监听*/
    $form_add_task.on('click',function (e) {
        var new_task = {};
        /*禁用默认行为*/
        e.preventDefault();
        /*获取新Task内容*/
        var $input = $('div.add-task').find('input[name=content]');
        new_task.content = $input.val();
        /*如果输入内容为空 不执行直接返回*/
        if(!new_task.content){
            alert('WHATS YOUR PROBLEM!');
            return
        }
        /*将新Task存入StoreJS*/
        // console.log('new_task',new_task);
        if(add_task(new_task)){
            render_task_list();
            $input.val('');
        }
    });
    /*将新的task存入到store.js*/
    function add_task(new_task) {
        /*将新Task推入task_list*/
        task_list.push(new_task);
        /*更新localStore*/
        store.set('task_list',task_list);
        return true;

    }

    /*开机函数*/
    function init() {
        task_list = store.get('task_list') || [];
        if(task_list.length){render_task_list();}
    }
    

})();

