<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button type="primary" size="medium" icon="el-icon-document-add" @click="handleAdd">
          新增
        </el-button>
      </div>
      <div>
        <el-input v-model="listQuery.tagName" size="medium" placeholder="标签名" style="width: 160px;" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.tagCode" size="medium" placeholder="标签编码" style="width: 160px;" @keyup.enter.native="handleFilter" />
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
      :data="labelsList"
      highlight-current-row
      height="calc(100vh - 274px)"
      style="width: 100%;margin-top: 32px;"
    >
      <el-table-column
        prop="tagName"
        label="标签名"
      />
      <el-table-column
        prop="tagCode"
        label="标签编码"
      />
      <el-table-column
        prop="docCreatorName"
        label="创建者"
      />
      <el-table-column
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 8px">{{ scope.row.docCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tagDesc"
        label="标签描述"
      >
        <template slot-scope="scope">
          {{ scope.row.tagDesc || '-' }}
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
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getLabels" />

    <el-dialog :title="dialogStatus === 'add' ? '新增标签' : '编辑标签'" :visible.sync="dialogFormVisible" :width="'33%'">
      <el-form ref="labelForm" :rules="rules" :model="labelForm" label-width="80px">
        <el-form-item label="标签名" prop="tagName">
          <el-input v-model="labelForm.tagName" />
        </el-form-item>
        <el-form-item label="标签编码" prop="tagCode">
          <el-input v-model="labelForm.tagCode" />
        </el-form-item>
        <el-form-item label="标签描述" prop="tagDesc">
          <el-input v-model="labelForm.tagDesc" :autosize="{ minRows: 3, maxRows: 6}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button :loading="dialoadLoading" type="primary" @click="dialogStatus==='add'? addLabel() : updateLabel()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime, parseParams, resetObject } from '@/utils'
import { getLabels, addLabel, updateLabel, deleteLabel } from '@/api/labels'

export default {
  name: 'Labels',
  components: { Pagination },
  data() {
    const validatorTagCode = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入标签标号'))
      } else if (!/^[a-z0-9]+$/i.test(value)) {
        callback(new Error('标签编号由数字与字母组成'))
      } else {
        callback()
      }
    }

    return {
      labelsList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        tagCode: '',
        tagName: '',
        docCreatorName: ''
      },
      filterLoading: false,
      dialoadLoading: false,
      dialogTitle: '',
      dialogStatus: '',
      dialogFormVisible: false,
      labelForm: {
        tagName: '',
        tagCode: '',
        tagDesc: ''
      },
      rules: {
        tagName: [{ required: true, trigger: 'blur', message: '请输入标签名' }],
        tagCode: [{ required: true, trigger: 'blur', validator: validatorTagCode }],
        tagDesc: [{ required: true, trigger: 'blur', message: '请输入标签描述' }]
      },
      activeUuid: ''
    }
  },
  watch: {
    dialogFormVisible(newVal) {
      this.$refs.labelForm && newVal && this.$refs.labelForm.clearValidate()
    }
  },
  created() {
    this.getLabels()
  },
  methods: {
    parseTime,
    getLabels(fromFilter = false) {
      this.listLoading = true
      fromFilter && (this.filterLoading = true)
      getLabels(parseParams(this.listQuery)).then(response => {
        const { list, total } = response
        this.total = total
        this.labelsList = list
        this.listLoading = false
        fromFilter && (this.filterLoading = false)
      }).catch(() => {
        this.listLoading = false
        fromFilter && (this.filterLoading = false)
      })
    },
    handleFilter() {
      this.getLabels(true)
    },
    handleAdd() {
      this.labelForm = {
        tagName: '',
        tagCode: '',
        tagDesc: ''
      }
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    handleEdit(label) {
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.labelForm.tagName = label.tagName
      this.labelForm.tagCode = label.tagCode
      this.labelForm.tagDesc = label.tagDesc
      this.activeUuid = label.uuid
    },
    handleDelete(label) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLabel({ uuid: label.uuid }).then(response => {
          this.getLabels()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(_ => {})
    },
    addLabel() {
      this.$refs.labelForm.validate(valid => {
        if (valid) {
          this.dialoadLoading = true
          addLabel(this.labelForm).then(response => {
            this.dialoadLoading = false
            this.dialogFormVisible = false
            this.getLabels()
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
    updateLabel() {
      this.$refs.labelForm.validate(valid => {
        if (valid) {
          this.dialoadLoading = true
          updateLabel({
            ...this.labelForm,
            uuid: this.activeUuid
          }).then(response => {
            this.dialoadLoading = false
            this.dialogFormVisible = false
            this.getLabels()
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
      this.getLabels()
    }
  }
}
</script>
