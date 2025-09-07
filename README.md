# Welcome to your epub4you - minimal demo app 👋

Aplikacja prezentuje dwa podejścia do czytania epubów - jedno z wykorzystaniem biblioteki
`@epubjs-react-native` i drugie z napisanym "od zera" parserem EPUBów. 

Większość bibliotek do parsowania i wyświetlania epubów w react native zostało porzuconych, albo jak to zwykle jest problem z customizowaniem tego jak chcemy.

Dlatego zaprezentowałem też drugie podejście, gdzie zczytuje epub zgodnie ze standardem (w zasadzie epub to zbiór plików xhtml które możemy w miarę łatwo wyświelić) i wyświetlam w webview jako html. 

Które podejście byłoby lepsze pewnie zależy od większej wiedzy o tym jak planujecie rozwijać dalej produkt.

## Uruchomienie projektu


1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app
wydaje mi się że z wykorzystaniem expo-go nie działa pobieranie epubu z internetu, dlatego sugeruje jednak: 

   ```bash
   npx expo run:ios --device
    lub
   npx expo run:android --device
   ```
