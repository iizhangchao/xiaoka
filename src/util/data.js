/**
 * Created by Administrator on 2018/3/15.
 */
// let taskData = [
//   {
//     tid: 1,
//     title: 'TASK测试数据今天出现',
//     content: '没什么好说的',
//     type: 1,
//     start: 1510156800000,
//     end: 1510243199000,
//     week: null,
//     completion: null,
//     completionDate: null,
//     date: 1510243199000,
//   },
//   {
//     tid: 2,
//     title: 'TASK测试数据2',
//     content: '没什么好说的',
//     type: 1,
//     start: 1510156800000,
//     end: 1510243199000,
//     weeks: null,
//     completion: null,
//     completionDate: null,
//     date: 1510243199000,
//   },
//   {
//     tid: 3,
//     title: 'TASK测试数据3',
//     content: '没什么好说的',
//     type: 1,
//     start: 1510272000000,
//     end: 1510243199000,
//     weeks: null,
//     completion: null,
//     completionDate: null,
//     date: 1510243199000,
//   },
//   {
//     tid: 4,
//     title: 'TASK测试数据4',
//     content: '没什么好说的',
//     type: 2,
//     start: 1510156800000,
//     end: 1512057599000,
//     weeks: '1,2,3,4,5,6,7',
//     completion:null,
//     completionDate: null,
//     date: 1510243199000,
//   },
//   {
//     tid: 5,
//     title: 'TASK测试数据5',
//     content: '没什么好说的',
//     type: 2,
//     start: 1510156800000,
//     end: 1512057599000,
//     weeks: '1,2',
//     completion: null,
//     completionDate: null,
//     date: 1510243199000,
//   }
// ]

const calcStartTime = date => {
  return new Date(`${date} 0:0:0`).getTime()
}

const calcEndtime = date => {
  return new Date(`${date} 23:59:59`).getTime()
}

const setWxStorage = data => {
  wx.setStorageSync('TASKDATA', data)
}

const getWxStrogage = () => {
  let val = wx.getStorageSync('TASKDATA')
  return !!val ? val : []
}

const getTask = () => {
  let today = new Date().getTime()
  let restData = []
  let taskData = getWxStrogage()
  
  taskData.forEach(item => {
    if (item.start <= today && item.end >= today) {
      if (item.type === 1) {
        let data = handleDone(item)
        restData.push(data)
      } else {
        let w = new Date().getDay()
        if (item.weeks.indexOf(w) > -1) {
          let data = handleDone(item)
          restData.push(data)
        }
      }
    }
  })
  return restData.length !== 0 ? {ret: 0,data: restData} : {ret: -1,msg: '没有数据'}
}

const addTask = data => {
  let allTask = getWxStrogage()
  data.forEach(item => {
    let { type, start, end, weeks } = item
  
    data.weeks = (type === 2 && weeks === null) ? '1,2,3,4,5,6,7' : null

    item.end = type === 1 ? calcEndtime(start) : calcEndtime(end)
    item.start = calcStartTime(start)
    
    item.tid = allTask.length
    item.date = new Date().getTime()
    item.completion = null
    item.completionDate = null
    
    allTask.push(item)
  })
  setWxStorage(allTask)
  
  return {
    ret: 0,
    msg: '成功'
  }
}

const handleDone = data => {
  let { completion, completionDate } = data
  
  if (completionDate !== null) {
    let doneDate = new Date(completionDate).toLocaleDateString()
    let nowDate = new Date().toLocaleDateString()
    
    if (doneDate === nowDate) {
      data.handle = 1
      if (completion === 1) {
        data.handleOK = 1
      } else {
        data.handleOK = 0
      }
    } else {
      data.handle = 0
      data.handleOK = 0
    }
    
  } else {
    data.handle = 0
    data.handleOK = 0
  }
  
  return {
    tid: data.tid,
    title: data.title,
    content: data.content,
    handle: data.handle,
    handleOK: data.handleOK
  }
  
}

const updateTask = data => {
  let taskData = getWxStrogage()
  let upDate = taskData[data.tid]
  
  upDate.completion = data.completion
  upDate.completionDate = new Date().getTime()
  
  setWxStorage(taskData)
}

export default {
  getTask,
  addTask,
  updateTask
}
