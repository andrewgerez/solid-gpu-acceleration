import { createEffect, on, createSignal } from 'solid-js'
import { ElementNode, activeElement, View } from '@lightningtv/solid'
import { LazyUp } from '@lightningtv/solid/primitives'
import { Column, Row } from '@lightningtv/solid/primitives'
import { Hero, TitleRow } from '../components'
import styles from '../styles'
import { setGlobalBackground } from '../state'
import ContentBlock from '../components/content-block'
import { debounce } from '@solid-primitives/scheduled'

const TMDB = (props) => {
  const [heroContent, setHeroContent] = createSignal({})
  let contentBlock,
    appLogo,
    firstRun = true

  const delayedBackgrounds = debounce(setGlobalBackground, 800)
  const delayedHero = debounce(
    (content: {}) => setHeroContent(content || {}),
    600
  )

  createEffect(
    on(
      activeElement,
      (elm) => {
        if (!elm) return

        if (firstRun) {
          elm.backdrop && setGlobalBackground(elm.backdrop)
          elm.heroContent && setHeroContent(elm.heroContent)
          firstRun = false
        } else {
          elm.backdrop && delayedBackgrounds(elm.backdrop)
          elm.heroContent && delayedHero(elm.heroContent)
        }
      },
      { defer: true }
    )
  )

  function onSelectedChanged(this: ElementNode, selectedIndex) {
    const values =
      selectedIndex === 0 ? { y: 300, alpha: 1 } : { y: 200, alpha: 0 }
    contentBlock
      .animate(values, { duration: 300, easing: 'ease-in-out' })
      .start()

    const values2 =
      selectedIndex === 0 ? { y: 80, alpha: 1 } : { y: 0, alpha: 0 }
    appLogo
      .animate(values2, { duration: 300, easing: 'ease-in-out' })
      .start()
  }

  return (
    <>
      <View
        ref={appLogo}
        width={1920}
        height={1}
        y={-50}
        style={styles.Header}
        zIndex={105}
      >
        <View src='./assets/logo.png' width={280} height={260} />
      </View>

      <ContentBlock
        ref={contentBlock}
        y={300}
        x={162}
        content={heroContent()}
      />
      <LazyUp
        y={500}
        component={Column}
        direction='column'
        upCount={3}
        each={props.data.rows}
        id='BrowseColumn'
        onSelectedChanged={onSelectedChanged}
        autofocus={props.data.rows[0].items()}
        gap={40}
        transition={{ y: { duration: 300, easing: 'ease-in-out' } }}
        style={styles.Column}
      >
        {(row) =>
          row().type === 'Hero' ? (
            <LazyUp
              component={Row}
              direction='row'
              gap={80}
              upCount={3}
              scroll='center'
              centerScroll
              each={row().items()}
              y={50}
              height={row().height}
            >
              {(item) => <Hero {...item()} />}
            </LazyUp>
          ) : (
            <TitleRow
              row={row()}
              title={row().title}
              height={row().height}
              items={row().items()}
            />
          )
        }
      </LazyUp>
    </>
  )
}

export default TMDB
