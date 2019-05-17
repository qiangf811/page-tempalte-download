<template>
<section class="container">
  <el-dialog title="新建页面" :visible.sync="dialogFormVisible" width="1000px" :close-on-click-modal=false :show-close=false>
    <el-form ref="form" :model="form" label-width="90px">
      <fieldset>
        <legend>页面信息</legend>
        <el-row>
          <el-col :span="12">
            <el-form-item label="页面名称" prop="name" :rules="rule">
              <el-input v-model="form.name" placeholder="例如：账号管理"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件名称" prop="fileName" :rules="rule">
              <el-input v-model="form.fileName" placeholder="例如：count"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="所属模块" prop="modelName" :rules="rule">
              <el-input v-model="form.modelName" placeholder="例如：系统管理"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="查询接口" prop="searchUrl" :rules="rule">
              <el-input v-model="form.searchUrl" placeholder="例如：/api/count/list"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        
      </fieldset>

      <fieldset>
        <legend>搜索条件</legend>
        <div class="flex" v-for="(search, index) in form.searchs" :key="index">
          <el-form-item label="字段名称" class="flex-item" :prop="'searchs.'+index+'.fieldLabel'" :rules="rule">
            <el-input v-model="search.fieldLabel" placeholder="例如：账号"></el-input>
          </el-form-item>
          <el-form-item label="字段英文" class="flex-item" :prop="'searchs.'+index+'.fieldValue'" :rules="rule">
            <el-input v-model="search.fieldValue" placeholder="例如：name"></el-input>
          </el-form-item>
          <el-form-item label="字段类型" class="flex-item" :prop="'searchs.'+index+'.fieldType'" :rules="rule">
            <el-select v-model="search.fieldType" placeholder="请选择">
              <el-option v-for="item in searchTypesOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="flex-item flex-fixed m-l-20" v-if="index===0">
            <el-button type="primary" icon="el-icon-plus" @click="addColumns('searchs')">添加条件</el-button>
          </div>
          <div class="flex-item flex-fixed m-l-20" v-else>
            <el-button type="primary" icon="el-icon-minus" @click="removeColumns('searchs',index)">删除条件</el-button>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>表格主体</legend>
        <div class="flex">
          <el-form-item label="序列号" class="flex-item-fixed-260" prop="isShowIndex" :rules="rule">
            <el-radio v-model="form.isShowIndex" :label=true>显示</el-radio>
            <el-radio v-model="form.isShowIndex" :label=false>不显示</el-radio>
          </el-form-item>
          <el-form-item label="多选框" class="flex-item-fixed-260" prop="isShowCheckbox" :rules="rule">
            <el-radio v-model="form.isShowCheckbox" :label=true>显示</el-radio>
            <el-radio v-model="form.isShowCheckbox" :label=false>不显示</el-radio>
          </el-form-item>
          <el-form-item label="操作栏" class="flex-item-fixed-260" prop="tableOperation" :rules="rule">
            <el-select v-model="form.tableOperation" multiple filterable allow-create collapse-tags default-first-option placeholder="请选择表格操作栏">
              <el-option v-for="item in tableOperationOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="flex" v-for="(column, index) in form.tableColumns" :key="index">
          <el-form-item label="列中文名" class="flex-item" :prop="'tableColumns.'+index+'.fieldType'" :rules="rule">
            <el-input v-model="column.fieldLabel" placeholder="例如：账号"></el-input>
          </el-form-item>
          <el-form-item label="列字段名" class="flex-item" :prop="'tableColumns.'+index+'.fieldType'" :rules="rule">
            <el-input v-model="column.fieldValue" placeholder="例如：name"></el-input>
          </el-form-item>
          <el-form-item label="文本类型" class="flex-item" :prop="'tableColumns.'+index+'.fieldType'" :rules="rule">
            <el-select v-model="column.fieldType" placeholder="请选择">
              <el-option v-for="item in columnTypesOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="flex-item flex-fixed m-l-20" v-if="index===0">
            <el-button type="primary" icon="el-icon-plus" @click="addColumns('tableColumns')">添加条目</el-button>
          </div>
          <div class="flex-item flex-fixed m-l-20" v-else>
            <el-button type="primary" icon="el-icon-minus" @click="removeColumns('tableColumns',index)">删除条件</el-button>
          </div>
        </div>
      </fieldset>

      <!-- <fieldset>
        <legend>新建/编辑字段</legend>
        <div class="flex" v-for="(model, index) in form.modelColumns" :key="index">
          <el-form-item label="字段名称" class="flex-item" :prop="'modelColumns.'+index+'.fieldLabel'" :rules="rule">
            <el-input v-model="model.fieldLabel" placeholder="例如：账号"></el-input>
          </el-form-item>
          <el-form-item label="字段英文" class="flex-item" :prop="'modelColumns.'+index+'.fieldValue'" :rules="rule">
            <el-input v-model="model.fieldValue" placeholder="例如：name"></el-input>
          </el-form-item>
          <el-form-item label="字段类型" class="flex-item" :prop="'modelColumns.'+index+'.fieldType'" :rules="rule">
            <el-select v-model="model.fieldType" placeholder="请选择">
              <el-option v-for="item in searchTypesOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="flex-item flex-fixed m-l-20" v-if="index===0">
            <el-button type="primary" icon="el-icon-plus" @click="addColumns('modelColumns')">添加条件</el-button>
          </div>
          <div class="flex-item flex-fixed m-l-20" v-else>
            <el-button type="primary" icon="el-icon-minus" @click="removeColumns('modelColumns',index)">删除条件</el-button>
          </div>
        </div>
      </fieldset> -->

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</section>
</template>

<script>
import axios from 'axios'
import Utils from '../utils'
export default {
  data () {
    return {
      dialogFormVisible: true,
      rule: {
        required: true,
        message: '请填写信息',
        trigger: 'blur'
      },
      searchTypesOptions: [{
        value: 'text',
        label: 'Input输入框'
      }, {
        value: 'select',
        label: 'Select选择器'
      }, {
        value: 'date',
        label: '开始结束时间选择器'
      }],
      columnTypesOptions: [{
        value: 'time',
        label: '时间'
      }, {
        value: 'text',
        label: '文本'
      }],
      tableOperationOptions: [{
        value: 'add',
        label: '新建'
      }, {
        value: 'delete',
        label: '批量删除'
      }
      ],
      form: {
        name: '',
        fileName: '',
        searchUrl: '',
        modelName: '',
        searchs: [{
          fieldLabel: '',
          fieldValue: '',
          fieldType: ''
        }],
        isShowCheckbox: false,
        isShowIndex: true,
        tableOperation: [],
        tableColumns: [{
          fieldLabel: '',
          fieldValue: '',
          fieldType: ''
        }],
        modelColumns: [{
          fieldLabel: '',
          fieldValue: '',
          fieldType: ''
        }]
      }
    }
  },
  methods: {
    addColumns (scope) {
      this.form[scope].push({
        fieldLabel: '',
        fieldValue: '',
        fieldType: ''
      })
    },
    removeColumns (scope, index) {
      this.form[scope].splice(index, 1)
    },
    transformInputTypeBoolean (value) {
      let key = ''
      switch (value) {
        case 'text':
          key = 'textInput'
          break
        case 'select':
          key = 'seletInput'
          break
        case 'date':
          key = 'dateInput'
          break
        default:
          break
      }
      return key
    },
    transformTableColumnTypeToBoolean (value) {
      let key = ''
      switch (value) {
        case 'text':
          key = 'normalText'
          break
        case 'time':
          key = 'dateType'
          break
        default:
          break
      }
      return key
    },
    onSubmit () {
      // this.$refs.form.validate(valid => {
      //   if (valid) {
      //     const data = { ...this.form }
      //     // 转换查询元素类型
      //     for (const item of data.searchs) {
      //       item[this.transformInputTypeBoolean(item.fieldType)] = true
      //     }
      //     // 转换表单类型
      //     for (const item of data.modelColumns) {
      //       item[this.transformInputTypeBoolean(item.fieldType)] = true
      //     }
      //     // 转换操作栏字段
      //     const tableOperation = []
      //     for (const item of data.tableOperation) {
      //       tableOperation.push({ [item]: true })
      //     }
      //     data.tableOperation = tableOperation
      //     // 转换表格列类型
      //     for (const item of data.tableColumns) {
      //       item[this.transformTableColumnTypeToBoolean(item.fieldType)] = true
      //     }

      axios.post('/api/page', this.form, {
        responseType: 'blob'
      }).then(res => {
        Utils.fileDownload(res)
      })
      //   } else {
      //     return false
      //   }
      // })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  width: 1200px;
  border: 1px solid #eee;
}

fieldset {
  border: 1px solid #DCDFE6;
  margin-bottom: 20px;
}

.flex {
  display: flex;
}

.flex-item {
  flex: 1
}

.flex-fixed {
  flex: 0 0 100px;
}

.flex-item-fixed-260 {
  flex: 0 0 266px;
}

.m-l-20 {
  margin-left: 20px;
}
</style>
