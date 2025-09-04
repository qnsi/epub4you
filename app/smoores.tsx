import { Text } from 'react-native'
import { useEffect } from 'react';
import { Epub } from '@/packages/epub';

const epubUrl = 'https://www.gutenberg.org/cache/epub/60793/pg60793-images-3.epub';

const Smoores = () => {
  const readEpub = async () => {
    console.log("Trying to read from epub")
    const epub = await Epub.from(epubUrl)
    console.log("Title from epub: ", await epub.getTitle())
  }

  useEffect(() => {
    readEpub()
  }, [])

  return <Text></Text>
}

export default Smoores
