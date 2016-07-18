import { JobPageColors, } from '../../../constants/Theme'

export const title = {
  fontSize: 30,
  fontWeight: 100,
  marginTop: 10,
}

export const summaryContainer = {
  fontSize: 15,
  fontWeight: 300,
  marginTop: 10,
}

export const commandButtonsContainer = {
  marginTop: 30,
  marginBottom: 10,
}

export const summaryRunningJob = {
  fontWeight: 500,
}

export const commandRightButton = {
  float: 'right',
  marginLeft: 10,
}

export const commandButtonLeft = {
  float: 'left',
  marginLeft: 10,
}

export const commandButtonLabel = {
  fontWeight: 100,
  color: JobPageColors.commandButtonLabel,
}

export const startAllButton =  {
  backgroundColor: JobPageColors.startButton,
}

export const popoverContainer = {
  padding: 20,
  backgroundColor: JobPageColors.popoverBackground,
}

export const popoverButton = {
  color: JobPageColors.popoverButton,
  labelStyle: {
    fontWeight: 100,
    color: JobPageColors.commandButtonLabel,
  },
}

export const selector = {
  float: 'right',
  width: 100,
  marginRight: 15,
}

export const selectorLabel = {
  fontWeight: 300,
  fontSize: 14,
}

export const containerSelector = Object.assign({}, selector, {
  width: 120,
})

export const containerSelectorLabel = Object.assign({}, selectorLabel, {
  fontSize: 14,
})

export const filterInput= {
  fontWeight: 300,
  fontSize: 14,
}

export const selectorFloatingLabel= {
  color: 'red',
}
