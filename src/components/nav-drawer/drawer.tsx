import { useMatch, useNavigate } from '@solidjs/router'
import {
  View,
  Text,
  IntrinsicNodeProps,
  ElementNode,
} from '@lightningtv/solid'
import { Column } from '@lightningtv/solid/primitives'
import styles from './styles'
import Icon from '../icon'

interface NavButtonProps extends IntrinsicNodeProps {
  icon: string
  children: string
}

const NavButtonTextStyles = {
  fontSize: 38,
  x: 116,
  y: 18,
  height: 50,
  alpha: 0,
  $active: {
    alpha: 1,
  },
}

function NavButton(props: Readonly<NavButtonProps>) {
  return (
    <View {...props} forwardStates style={styles.NavButton}>
      <View y={-16}>
        <Icon scale={0.5} name={props.icon} />
      </View>
      <Text style={NavButtonTextStyles}>{props.children}</Text>
    </View>
  )
}

export default function NavDrawer(props: any) {
  let backdrop: ElementNode | undefined
  const navigate = useNavigate()
  function onFocus(el: ElementNode) {
    backdrop!.states.add('$focus')
    el.children.forEach((c) => c.states.add('$active'))
    el.children[el.selected ?? 0].setFocus()
  }

  function onBlur(el: ElementNode) {
    backdrop!.states.remove('$focus')
    el.selected = 0
    el.children.forEach((c) => c.states.remove('$active'))
  }

  function handleNavigate(page: string) {
    const isOnPage = useMatch(() => page)
    if (isOnPage()) {
      return props.focusPage()
    }

    navigate(page)
  }

  return (
    <>
      <Column
        {...props}
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.Column}
        scroll='none'
      >
        <NavButton
          onEnter={() => handleNavigate('/browse/all')}
          icon='home'
        >
          Home
        </NavButton>
        <NavButton icon='movies' onEnter={() => handleNavigate('/browse/movie')}>
          Movies
        </NavButton>
        <NavButton icon='series' onEnter={() => handleNavigate('/browse/tv')}>
          Series
        </NavButton>
      </Column>
      <View skipFocus ref={backdrop} style={styles.Gradient}></View>
    </>
  )
}
