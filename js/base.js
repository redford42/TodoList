;(function () {

    'use strict';
    var $form_add_task = $('#btn_add')
        ,$task_delete_trigger
        ,$task_detail_trigger
        ,$task_detail_mask = $('.task-detail-mask')
        ,$task_detail = $('.task-detail')
        ,task_list = {}
        ,$current_index
        ,$update_form
        ,$task_detail_content
        ,$task_detail_content_input
        ;


    /*声明一下开机启动函数*/
    init();



    /*添加Task的动作监听*/
    $form_add_task.on('click',on_add_task_form_submit);
    $task_detail_mask.on('click',hide_task_detail);

    /*查找并监听所有删除按钮的点击事件*/
    function listen_task_delete() {
        $task_delete_trigger.on('click',function () {
            var $this = $(this);
            /*找到删除按钮所在task元素*/
            var $item = $this.parent().parent();
            var index = $item.data('index');
            /*确认是否删除*/
            var tmp = confirm('确定删除？');
            /*调用delete_task*/
            tmp ? delete_task(index):null;
        })
    }

    function listen_task_detail() {
        $task_detail_trigger.on('click',function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');

            show_task_detail(index);
            console.log(index);

        })
    }
    /*查看Task注释*/
    function show_task_detail(index) {
        render_task_detail(index);
        $current_index = index;
        $task_detail.show();
        $task_detail_mask.show();
    }

    function update_task(index,data) {
        if(!index || !task_list[index])
            return;

        task_list[index] = /*$.merge({},task_list[index],*/data;
        refresh_task_list();
    }

    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }
    /*表单添加task*/
    function on_add_task_form_submit(e) {
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
        if(add_task(new_task)) {
            $input.val('');
        }
    }

    /*将新的task存入到store.js*/
    function add_task(new_task) {
        /*将新Task推入task_list*/
        task_list.push(new_task);
        /*更新localStore*/
        refresh_task_list();
        return true;
    }

    /*删除一条task*/
    function delete_task(index) {
        /*如果没有index或index在tasklist中不存在*/
        if(index == undefined || !task_list[index]) return;
        delete task_list[index];
        /*更新localStorage*/
        refresh_task_list();
    }

    /*刷新localStorage数据并更新Div模板*/
    function refresh_task_list() {
        store.set('task_list',task_list);
        render_task_list();
        return true;
    }
    /*渲染指定task的详细信息*/
    function render_task_detail(index) {
        if(index == undefined || !task_list[index])
            return;

        var item =task_list[index];

        console.log('item',item);

        var tpl ='<form>'+
        '<div class="content">' +
            item.content +
        '</div>' +
            '<div class="input-item"><input style="display: none;" type="text" name="content" value="' + (item.content || '')+ '"></div>'+
        '<div>' +
        '<div class="desc input-item">' +
        '<textarea name="desc">'+ (item.desc || '')+ '</textarea>' +
        '</div>' +
        '</div>' +
        '<div class="remind">' +
        '<input name="remind_date" type="date" value="'+ item.remind_date + '">' +
        '</div>' +
            '<div><button type="submit">更新</button></div>' +
        '</form>';

        $task_detail.html('');
        $task_detail.html(tpl);
        $update_form = $task_detail.find('form');
        $task_detail_content = $update_form.find('.content');
        $task_detail_content_input = $update_form.find('[name=content]');
        console.log('$update_form',$update_form);

        $task_detail_content.on('dblclick',function () {
            $task_detail_content_input.show();
            $task_detail_content.hide();
        })
        $update_form.on('submit',function (e) {
            e.preventDefault();
            var data = {};
            data.content = $(this).find('[name = content]').val();
            data.desc = $(this).find('[name = desc]').val();
            data.remind_date = $(this).find('[name = remind_date]').val();

            console.log(data);
            //写入localstorage
            update_task(index,data);
            hide_task_detail();
        })
    }
    /*
    *渲染【.task_list】的函数
    */
    function render_task_list() {
        var $task_list = $('.tasks-list');
        $task_list.html('');
        for(var i = 0;i<task_list.length;i++){
            var $task = render_task_item(task_list[i],i);
            $task_list.prepend($task);
        }

        $task_delete_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        $task_detail_mask = $('.task-detail-mask');
        listen_task_delete();
        listen_task_detail();
    }
    /*
    *渲染一条task的模板
    */
    function render_task_item(data,index) {
        if(!data || !index) return;
        var list_item_tpl =
            '<div class="task-item" data-index="'+ index +'">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="fr">' +
            '<span class="action delete"> 删除</span>' +
            '<span class="action detail"> 详细</span>' +
            '</span>' +
            '</div>';
        return $(list_item_tpl);
    }

    /*开机函数*/
    function init() {
        task_list = store.get('task_list') || [];
        if(task_list.length) render_task_list();
    }
    

})();

