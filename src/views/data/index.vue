<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button type="primary" size="medium" icon="el-icon-document-add" @click="handleAdd">
          新增
        </el-button>
        <el-button size="medium" type="primary" icon="el-icon-upload" @click="handleUpload">
          导入
        </el-button>
        <el-button :loading="downloadLoading" size="medium" type="primary" icon="el-icon-download" @click="handleDownload">
          下载
        </el-button>
      </div>
      <div>
        <el-input v-model="listQuery.mobile" size="medium" placeholder="手机号" style="width: 160px;" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.mobileName" size="medium" placeholder="姓名" style="width: 160px;" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.tag" clearable placeholder="所属标签" size="medium">
          <el-option
            v-for="item in labels"
            :key="item.tagCode"
            :label="item.tagName"
            :value="item.uuid"
          />
        </el-select>
        <el-input v-model="listQuery.docCreatorName" size="medium" placeholder="创建者" style="width: 160px;margin-right: 12px" @keyup.enter.native="handleFilter" />
        <el-button type="primary" icon="el-icon-search" size="medium" :loading="filterLoading" @click="handleFilter">
          查询
        </el-button>
        <el-button icon="el-icon-refresh" size="medium" @click="handleReset">
          重置
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      fit
      :data="dataList"
      highlight-current-row
      height="calc(100vh - 274px)"
      style="width: 100%;margin-top: 32px;"
    >
      <el-table-column
        prop="mobileName"
        label="姓名"
      />
      <el-table-column
        prop="mobile"
        label="手机号"
      />
      <el-table-column
        prop="docCreatorName"
        label="创建者"
      />
      <el-table-column
        prop="tag"
        label="所属标签"
      >
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 8px">{{ scope.row.docCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getData" />

    <el-dialog :title="dialogStatus === 'add' ? '新增' : '编辑'" :visible.sync="dialogFormVisible" :width="'33%'">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" />
        </el-form-item>
        <el-form-item label="姓名" prop="mobileName">
          <el-input v-model="form.mobileName" />
        </el-form-item>
        <el-form-item label="所属标签" prop="tag">
          <el-select v-model="form.tag" clearable placeholder="请选择">
            <el-option
              v-for="item in labels"
              :key="item.tagCode"
              :label="item.tagName"
              :value="item.uuid"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button :loading="dialoadLoading" type="primary" @click="dialogStatus==='add'? addData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入数据" :visible.sync="uploadDialogVisible" :width="'33%'">
      <div class="template">
        <el-button
          :loading="templateLoading"
          type="text"
          icon="el-icon-download"
          @click="downloadTemplate"
        >
          数据模版
        </el-button>
      </div>
      <el-upload
        class="upload"
        drag
        with-credentials
        action="string"
        :http-request="uploadData"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx格式文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime, parseParams, resetObject, handleDownFile } from '@/utils'
import { getLabelList } from '@/api/labels'
import { getData, addData, updateData, deleteData, downloadData, uploadData, getTemplate } from '@/api/data'

export default {
  name: 'Data',
  components: { Pagination },
  data() {
    return {
      dataList: [],
      labels: [],
      total: 0,
      templateLoading: false,
      downloadLoading: false,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        mobileName: '',
        mobile: '',
        docCreatorName: ''
      },
      filterLoading: false,
      dialoadLoading: false,
      dialogTitle: '',
      dialogStatus: '',
      dialogFormVisible: false,
      form: {
        mobile: '',
        mobileName: '',
        tag: ''
      },
      rules: {
        mobile: [{ required: true, trigger: 'blur', message: '请输入标签名' }],
        mobileName: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        tag: [{ required: true, trigger: 'change', message: '请选择标签' }]
      },
      uploadDialogVisible: false,
      activeUuid: ''
    }
  },
  watch: {
    dialogFormVisible(newVal) {
      this.$refs.form && newVal && this.$refs.form.clearValidate()
    }
  },
  created() {
    this.getData()
    this.getLabels()
  },
  methods: {
    parseTime,
    getLabels() {
      getLabelList().then(response => {
        this.labels = response
      })
    },
    getData(fromFilter = false) {
      this.listLoading = true
      fromFilter && (this.filterLoading = true)
      getData(parseParams(this.listQuery)).then(response => {
        const { list, total } = response
        this.total = total
        this.dataList = list
        this.listLoading = false
        fromFilter && (this.filterLoading = false)
      }).catch(() => {
        this.listLoading = false
        fromFilter && (this.filterLoading = false)
      })
    },
    handleFilter() {
      this.getData(true)
    },
    handleAdd() {
      this.form = {
        mobile: '',
        mobileName: '',
        tag: ''
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    handleEdit(data) {
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.form.mobile = data.mobile
      this.form.mobileName = data.mobileName
      this.form.tag = data.tag
      this.activeUuid = data.uuid
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData({ uuid: data.uuid }).then(response => {
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(_ => {})
    },
    addData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialoadLoading = true
          addData(this.form).then(response => {
            this.dialoadLoading = false
            this.dialogFormVisible = false
            this.getData()
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          }).catch(_ => {
            this.dialoadLoading = false
          })
        } else {
          return false
        }
      })
    },
    updateData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialoadLoading = true
          updateData({
            ...this.form,
            uuid: this.activeUuid
          }).then(response => {
            this.dialoadLoading = false
            this.dialogFormVisible = false
            this.getData()
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }).catch(_ => {
            this.dialoadLoading = false
          })
        } else {
          return false
        }
      })
    },
    handleReset() {
      this.listQuery = {
        ...resetObject(this.listQuery),
        pageNum: 1,
        pageSize: 20
      }
      this.getData()
    },
    handleDownload() {
      this.downloadLoading = true
      downloadData(parseParams(this.listQuery)).then(response => {
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        this.downloadLoading = false
        handleDownFile(blob, `${parseTime(Date.now())}.xlsx`)
      }).catch(_ => {
        this.downloadLoading = false
      })
    },
    handleUpload() {
      this.uploadDialogVisible = true
    },
    downloadTemplate() {
      this.templateLoading = true
      getTemplate().then(response => {
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        this.templateLoading = false
        handleDownFile(blob, `模版.xlsx`)
      }).catch(_ => {
        this.templateLoading = false
      })
    },
    uploadData(data) {
      const formData = new FormData()
      formData.append('file', data.file)
      uploadData(formData).then(response => {
        this.$message({
          type: 'success',
          message: '数据上传成功'
        })
        this.uploadDialogVisible = false
        this.getData()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.upload {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.template {
  text-align: right;

  button {
    padding: 0;
  }
}
</style>
