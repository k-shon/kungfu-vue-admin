<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            @click="searchBrandList()"
            type="primary"
            size="medium">
            查询
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="姓名/关键信息"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>成员列表</span>
      <el-button
        class="btn-add"
        @click="addBrand()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="姓名" width="100" align="center">
          <template slot-scope="scope">{{scope.row.person.nickname}}</template>
        </el-table-column>
        <el-table-column label="职位" width="100" align="center">
          <template slot-scope="scope">{{scope.row.position}}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">{{scope.row.state}}</template>
        </el-table-column>
		<el-table-column label="入馆时间" width="260" align="center">
		  <template slot-scope="scope">{{scope.row.inTime}}</template>
		</el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showUpdateDialog(scope.$index, scope.row)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteMember(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
	<!--修改信息对话框-->
	<el-dialog title="修改成员信息"
	           :visible.sync="dialogVisible"
	           width="40%">
	  <el-form :model="member"
	           ref="memberForm"
	           label-width="150px">
	    <el-form-item label="姓名：">
	      <el-input v-model="member.person.nickname" style="width: 200px" :disabled="true"></el-input>
	    </el-form-item>
	    <el-form-item label="手机号码：">
	      <el-input v-model="member.person.mobileNumber" style="width: 200px" :disabled="true">
	      </el-input>
	    </el-form-item>
	    <el-form-item label="职位：">
	      <el-input v-model="member.position" style="width: 200px"></el-input>
	    </el-form-item>
		<el-form-item label="状态：">
		  <el-input v-model="member.state" style="width: 200px">
		  </el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	  <el-button @click="dialogVisible = false">取 消</el-button>
	  <el-button type="primary" @click="updateMember()">确 定</el-button>
	  </span>
	</el-dialog>
  </div>
</template>
<script>
  import {fetchList, updateShowStatus, updateFactoryStatus, deleteBrand} from '@/api/brand'
  import {getAllMember,updateMember,deleteMember} from '@/api/dojo';
  import { Message } from 'element-ui'
  
  var checkIndex = 0
  export default {
    name: 'brandList',
    data() {
      return {
        operates: [
          {
            label: "显示品牌",
            value: "showBrand"
          },
          {
            label: "隐藏品牌",
            value: "hideBrand"
          }
        ],
        operateType: null,
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
		member:{
			id:'', //一定要附上，否则是新增记录，而不是更新
			person:{
				id:'',
				nickname:'',
				mobileNumber:''
			},
			position:'',
			state:''
		},
        total: null,
        listLoading: true,
        multipleSelection: [],
		dialogVisible:false
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getAllMember().then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
	  /*显示修改信息对话框*/
      showUpdateDialog(index, row) {
		this.member.person.id = this.list[index].person.id
		this.member.person.nickname = this.list[index].person.nickname
		this.member.person.mobileNumber = this.list[index].person.mobileNumber
		this.member.position = this.list[index].position
		this.member.state = this.list[index].state
		this.member.id = this.list[index].id
		this.dialogVisible = true
		checkIndex = index 
      },
	  /*修改信息*/
	  updateMember(){
		  var that = this
		  console.log("member:",that.member)
		  updateMember(that.member).then(res=>{
			  that.list[checkIndex].position = this.member.position
			  that.list[checkIndex].state = this.member.state
			  if(res.status == 200){
				  that.dialogVisible = false
				  Message({
				    message: '修改成功',
				    type: 'success',
				    duration: 1000
				  })
			  }else{
				  Message({
				    message: res.msg,
				    type: 'error',
				    duration: 3 * 1000
				  })
			  }
		  })
	  },
      deleteMember(index, row) {
		  var that = this
        this.$confirm('是否要删除该成员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMember(row.id).then(response => {
			  //移除删除的内容
			  
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      getProductList(index, row) {
        console.log(index, row);
      },
      getProductCommentList(index, row) {
        console.log(index, row);
      },
      handleFactoryStatusChange(index, row) {
        var data = new URLSearchParams();
        data.append("ids", row.id);
        data.append("factoryStatus", row.factoryStatus);
        updateFactoryStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.factoryStatus === 0) {
            row.factoryStatus = 1;
          } else {
            row.factoryStatus = 0;
          }
        });
      },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        ;
        data.append("ids", row.id);
        data.append("showStatus", row.showStatus);
        updateShowStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.showStatus === 0) {
            row.showStatus = 1;
          } else {
            row.showStatus = 0;
          }
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      searchBrandList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleBatchOperate() {
        console.log(this.multipleSelection);
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let showStatus = 0;
        if (this.operateType === 'showBrand') {
          showStatus = 1;
        } else if (this.operateType === 'hideBrand') {
          showStatus = 0;
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        let data = new URLSearchParams();
        data.append("ids", ids);
        data.append("showStatus", showStatus);
        updateShowStatus(data).then(response => {
          this.getList();
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      addBrand() {
        this.$router.push({path: '/pms/addBrand'})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>


</style>


