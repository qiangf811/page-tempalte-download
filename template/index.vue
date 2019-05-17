<template>
<div>
  <!-- 面包屑 -->
  <div class="nav-top">
    <i class="fa fa-home"></i>
    <p class="nav-word"><%modelName%> &gt;<%name%></p>
  </div>
  <div>
    <el-form :inline="true" :model="searchParams" class="search-top">
      <%#searchs%>
        <el-form-item label="<%fieldLabel%>">
          <%#textInput%>
            <el-input v-model="searchParams.<%fieldValue%>" placeholder="<%fieldLabel%>"></el-input>
          <%/textInput%>
          <%#dateInput%>
            <DateTimeRange :labelType="1" firstLabelName="<%fieldLabel%>" :datetimeRange.sync="searchDatetimeRange" />
          <%/dateInput%>
          <%#seletInput%>
              <el-select v-model="searchParams.<%fieldValue%>" placeholder="<%fieldLabel%>">
                  <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
          <%/seletInput%>
        </el-form-item>
      <%/searchs%>
    </el-form>
    <%#tableOperation.length%>
      <div class="configure-operate">
        <%#tableOperation%>
          <%#add%>
            <el-button @click="handleAdd" type="primary" class="tunicorn-button">新建</el-button>
          <%/add%>
          <%#delete%>
            <div class="clearfix" style="float: right;">
              <el-button @click="handelMatchOperate('delete')" type="text" style="color:rgba(14, 228, 254, 0.88)">批量删除</el-button>
            </div>
          <%/delete%>
        <%/tableOperation%>
      </div>
      <%/tableOperation.length%>
        <!-- 表格主体 -->
        <div class="table-wrapper">
          <el-table class="reset-el-table" :stripe="true" v-loading="listLoading" element-loading-background="rgba(0, 0, 0, 0.8)" ref="multipleTable" :data="tableList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <%#isShowCheckbox%>
              <el-table-column type="selection" width="55"></el-table-column>
            <%/isShowCheckbox%>
            <%#isShowIndex%>
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope">
                    <span>{{(searchParams.pageNum-1)*searchParams.perPage+scope.$index+1}}</span>
                </template>
              </el-table-column>
            <%/isShowIndex%>
            <%#tableColumns%>
              <%#normalText%>
                <el-table-column header-align="center" align="center" prop="<%fieldValue%>" label="<%fieldLabel%>" show-overflow-tooltip></el-table-column>
              <%/normalText%>
              <%#dateType%>
                <el-table-column header-align="center" align="center" label="<%fieldLabel%>" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.<%fieldValue%> | timeFormatter}}</template>
                </el-table-column>
              <%/dateType%>
              <%#imageType%>
                <el-table-column header-align="center" align="center" label="<%fieldLabel%>" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span></span>
                    </template>
                </el-table-column>
              <%/imageType%>
            <%/tableColumns%>
            <%#columnOperation.length%>
              <el-table-column header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                  <%#columnOperation%>
                    <%#edit%>
                      <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <%/edit%>
                    <%#delete%>
                      <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
                    <%/delete%>
                  <%/columnOperation%>
                </template>
              </el-table-column>
            <%/columnOperation.length%>
          </el-table>
        </div>
        <!-- 分页组件 -->
        <pagination v-show="total>0" :total="total" :page.sync="searchParams.pageNum" :limit.sync="searchParams.perPage" @pagination="searchList" />
        <!-- 编辑新建弹窗 -->
        <el-dialog :title="detailStatus==='add'?'新增':'编辑'" width="790px" custom-class="customed-dialog" :visible.sync="isShowEdit">
            <AchievementEdit ref="detailForm" :caseTypeOptions="caseTypeOptions" @close="closeEditDiaolg" />
        </el-dialog>
        <!-- 删除弹窗 -->
        <el-dialog title="提示" width="382px" custom-class="" :visible.sync="isShowDeleteConfirm">
          <operation-confirm>
              <el-button @click="isShowDeleteConfirm = false;" type="primary" class="tunicorn-button">取消</el-button>
              <el-button @click="fetchDelete" type="primary" plain class="tunicorn-button" :loading="btnLoading">确认
              </el-button>
          </operation-confirm>
        </el-dialog>
  </div>
</div>
</template>
<script>
export default {
  name: 'Index',
  data: () => ({
    searchParams: {
      pageNum: 1,
      perPage: 20,
      <%#searchs%>
      <%fieldValue%>: '',
      <%/searchs%>
    },
    searchDatetimeRange: [],
    listLoading: false,
    total: 0,
    tableList: [],
    <%#isShowCheckbox%>
      multipleSelection: [],
    <%/isShowCheckbox%>
    singelSelectedRow: {},
    isShowEdit: false,
    detailStatus: '',
    isShowDeleteConfirm: false,
    btnLoading: false
  }),
  created () {
    this.handleSearch()
  },
  methods: {
    handleSearch () {
     this.searchParams.pageNum = 1
     this.$set(this.searchParams, 'startTime', this.searchDatetimeRange[0])
     this.$set(this.searchParams, 'endTime', this.searchDatetimeRange[1])
     this.searchList()
   },
   async searchList () {
     try {
       this.listLoading = true
       const params = Object.assign({}, this.searchParams, { pageNum: this.searchParams.pageNum - 1 })
       const { data = {} } = await AchievementAPI.getList(params)
       const list = data.achievements || []
       this.tableList = list
       this.total = data.totalCount || 0
       this.listLoading = false
     } catch (error) {
       console.error(error)
       this.$message.error('服务异常，获取列表数据失败')
     }
   },
   <%#tableOperation%>
     <%#add%>
       handleAdd () {
         this.detailStatus = 'add'
         this.isShowEdit = true
         this.$nextTick(() => {
           this.$refs['detailForm'].resetModel()
           this.$refs['detailForm'].clearValidate()
         })
       },
     <%/add%>
     <%#delete%>
       handelMatchOperate () {
         if (!this.multipleSelection.length) {
           this.$message({
             message: '请至少选择一条记录',
             type: 'warning'
           })
           return
         }
         this.isShowDeleteConfirm = true
       },
     <%/delete%>
   <%/tableOperation%>
   <%#columnOperation%>
     <%#edit%>
       handleEdit (row) {
         this.detailStatus = 'edit'
         this.isShowEdit = true
         this.$nextTick(() => {
           row.caseTypes = this.getCaseTypes(row.caseType)
           this.$refs['detailForm'].model = { ...row }
           this.$refs['detailForm'].clearValidate()
         })
       },
     <%/edit%>
     <%#delete%>
       handleDelete (row) {
         this.singelSelectedRow = row
         this.isShowDeleteConfirm = true
       },
     <%/delete%>
   <%/columnOperation%>
   <%#isShowCheckbox%>
     handleSelectionChange (selection) {
       this.multipleSelection = selection
     },
   <%/isShowCheckbox%>
   closeEditDiaolg (isUpdate) {
     isUpdate && this.handleSearch()
     this.isShowEdit = false
   },
   async fetchDelete () {
     try {
       this.btnLoading = true
       const id = this.singelSelectedRow.id
       await AchievementAPI.remove(id)
       this.handleSearch()
       this.$message({
         message: '删除成功',
         type: 'success'
       })
       this.isShowDeleteConfirm = false
     } catch (err) {
       this.$message({
         message: err.errorMessage || '删除失败',
         type: 'error'
       })
     } finally {
       this.btnLoading = false
     }
   }
  }
}
</script>
<style lang="scss" scoped>
</style>
