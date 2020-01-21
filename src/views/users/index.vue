<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button type="primary" size="medium" icon="el-icon-document-add" @click="handleAdd">
          新增
        </el-button>
      </div>
      <div>
        <el-input v-model="listQuery.userName" size="medium" placeholder="用户名" style="width: 160px;" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.userCode" size="medium" placeholder="用户账号" style="width: 160px;" @keyup.enter.native="handleFilter" />
        <el-select
          v-model="listQuery.tags"
          size="medium"
          multiple
          clearable
          collapse-tags
          placeholder="标签"
        >
          <el-option
            v-for="item in labels"
            :key="item.tagCode"
            :label="item.tagName"
            :value="item.uuid"
          />
        </el-select>
        <el-cascader
          size="medium"
          :options="departments"
          :props="cascaderProps"
          placeholder="所属部门"
          :show-all-levels="false"
          clearable
          @change="handleFilterDept"
        />
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
      :data="usersList"
      highlight-current-row
      height="calc(100vh - 274px)"
      style="width: 100%;margin-top: 32px;"
    >
      <el-table-column
        prop="userName"
        label="用户名"
      />
      <el-table-column
        prop="userCode"
        label="用户账号"
      />
      <el-table-column
        label="管理标签"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.tags"
            :key="tag.uuid"
            type="info"
            class="tag"
          >
            {{ tag.tagName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="userDeptName"
        label="所属部门"
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
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getUsers" />

    <el-dialog :title="dialogStatus === 'add' ? '新增用户' : '编辑用户'" :visible.sync="dialogFormVisible" :width="'33%'">
      <el-form ref="userForm" :rules="rules" :model="userForm" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" />
        </el-form-item>
        <el-form-item label="用户账号" prop="userCode">
          <el-input v-model="userForm.userCode" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'add'" label="用户密码" prop="userPswd">
          <el-input v-model="userForm.userPswd" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="userForm.tags"
            multiple
            clearable
            collapse-tags
          >
            <el-option
              v-for="item in labels"
              :key="item.tagCode"
              :label="item.tagName"
              :value="item.uuid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="userDeptId">
          <el-cascader
            v-model="dept"
            :options="departments"
            :props="cascaderProps"
            :show-all-levels="false"
            clearable
            @change="handleFormDept"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button :loading="dialoadLoading" type="primary" @click="dialogStatus==='add'? addUser() : updateUser()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime, parseParams, resetObject, parseTree } from '@/utils'
import { getDepts } from '@/api/department'
import { getLabelList } from '@/api/labels'
import { getUsers, addUser, updateUser, deleteUser } from '@/api/users'

export default {
  name: 'Users',
  components: { Pagination },
  data() {
    const validatorUserCode = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户账号'))
      } else if (!/^[a-z0-9]+$/i.test(value)) {
        callback(new Error('用户账号由数字与字母组成'))
      } else {
        callback()
      }
    }

    return {
      usersList: null,
      total: 0,
      listLoading: true,
      labels: [],
      originDepts: [],
      departments: [],
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        userCode: '',
        userName: '',
        tags: [],
        userDeptId: '',
        docCreatorName: ''
      },
      filterLoading: false,
      dialoadLoading: false,
      dialogTitle: '',
      dialogStatus: '',
      dialogFormVisible: false,
      userForm: {
        userName: '',
        userCode: '',
        userPswd: '',
        tags: [],
        userDeptId: '',
        userDeptName: ''
      },
      rules: {
        userName: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        userCode: [{ required: true, trigger: 'blur', validator: validatorUserCode }],
        userPswd: [{ required: true, trigger: 'blur', message: '请输入用户密码' }],
        tags: [{ required: true, trigger: 'blur', message: '请给该用户分配权限标签' }],
        userDeptId: [{ required: true, trigger: 'blur', message: '请选择用户所属部门' }]
      },
      cascaderProps: {
        value: 'id',
        multiple: false
      },
      dept: [],
      activeUuid: ''
    }
  },
  watch: {
    dialogFormVisible(newVal) {
      this.$refs.userForm && newVal && this.$refs.userForm.clearValidate()
    }
  },
  created() {
    this.getLabels()
    this.getDepartments()
    this.getUsers()
  },
  methods: {
    parseTime,
    getLabels() {
      getLabelList().then(response => {
        this.labels = response
      })
    },
    getDepartments() {
      getDepts().then(response => {
        this.originDepts = response
        this.departments = [parseTree(response)]
      })
    },
    getUsers(fromFilter = false) {
      this.listLoading = true
      fromFilter && (this.filterLoading = true)
      const params = parseParams(this.listQuery)
      if (params.tags && params.tags.length) {
        params.tags = params.tags.map(tag => { return { uuid: tag } })
      }
      const { pageNum, pageSize, ...param } = params
      const _params = { pageNum, pageSize }
      if (Object.keys(param).length) {
        _params.list = [param]
      }
      getUsers(_params).then(response => {
        const { list, total } = response
        this.total = total
        this.usersList = list
        this.listLoading = false
        fromFilter && (this.filterLoading = false)
      }).catch(() => {
        this.listLoading = false
        fromFilter && (this.filterLoading = false)
      })
    },
    handleFilterDept(data) {
      const selectedDeptId = data[1]
      this.listQuery.userDeptId = selectedDeptId
    },
    handleFormDept(data) {
      const selectedDeptId = data[1]
      this.userForm.userDeptId = selectedDeptId
      this.originDepts.forEach(d => {
        if (d.uuid === selectedDeptId) {
          this.userForm.userDeptName = d.deptName
        }
      })
    },
    handleFilter() {
      console.log(this.listQuery)
      this.getUsers(true)
    },
    handleAdd() {
      this.userForm = resetObject(this.userForm)
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
    },
    handleEdit(user) {
      this.dept = []
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.userForm.userName = user.userName
      this.userForm.userCode = user.userCode
      // this.userForm.tags = user.tags
      this.originDepts.forEach(d => {
        if (d.uuid === user.userDeptId) {
          this.dept.push(d.parentDeptId, d.uuid)
        }
      })
      this.activeUuid = user.uuid
    },
    handleDelete(user) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ uuid: user.uuid }).then(response => {
          this.getUsers()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(_ => {})
    },
    addUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.dialoadLoading = true
          addUser(this.userForm).then(response => {
            this.dialoadLoading = false
            this.dialogFormVisible = false
            this.getUsers()
            this.dept = []
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
    updateUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.dialoadLoading = true
          const data = JSON.parse(JSON.stringify(this.userForm))
          data.uuid = this.activeUuid
          delete data.userPswd
          updateUser(data).then(response => {
            this.dialoadLoading = false
            this.dialogFormVisible = false
            this.getUsers()
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
      this.getUsers()
    }
  }
}
</script>
<style scoped>
.tag {
  margin-right: 8px;
  margin-top: 4px;
}
</style>
