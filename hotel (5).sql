-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 16, 2025 at 06:23 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `pokoje`
--

CREATE TABLE `pokoje` (
  `id` int(11) NOT NULL,
  `zdjecia` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`zdjecia`)),
  `nazwa` varchar(255) NOT NULL,
  `opis` varchar(255) NOT NULL,
  `dlugiopis` varchar(500) NOT NULL,
  `ulica` text NOT NULL,
  `nrdomu/mieszkania` varchar(255) NOT NULL,
  `cena` decimal(10,2) NOT NULL,
  `cena_za_m2` decimal(10,2) NOT NULL,
  `liczba_pokoi` int(11) NOT NULL,
  `wynajety_do` date DEFAULT NULL,
  `wynajety_przez` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pokoje`
--

INSERT INTO `pokoje` (`id`, `zdjecia`, `nazwa`, `opis`, `dlugiopis`, `ulica`, `nrdomu/mieszkania`, `cena`, `cena_za_m2`, `liczba_pokoi`, `wynajety_do`, `wynajety_przez`) VALUES
(1, '[\"ZolteMieszkanie1.jpeg\", \"ZolteMieszkanie2.jpeg\", \"ZolteMieszkanie3.jpeg\", \"ZolteMieszkanie4.jpeg\"]', 'Mieszkanie w zabytkowej kamienicy', 'Dwupokojowe mieszkanie o powierzchni 41 m², na pierwszym piętrze kamienicy.', 'Na sprzedaż dwupokojowe mieszkanie o powierzchni 41 m², zlokalizowane na pierwszym piętrze czteropiętrowej, przedwojennej kamienicy z windą.\r\n\r\nSalon: przestronny i jasny\r\nSypialnia: wyposażona w duże, wbudowane szafy i biurko\r\nKuchnia: w pełni wyposażona w sprzęt AGD\r\nŁazienka: wanna z deszczownicą\r\nPrzedpokój: z dwiema pojemnymi szafami\r\nBalkon: wyłożony drewnem, z widokiem na zieleń, tyły teatru oraz kameralny ogród przynależący do kamienicy', 'Stefana Jaracza', '67/4', 1250000.00, 30488.00, 2, '2025-03-17', 'user'),
(2, '[\"remont1.jpeg\", \"remont2.jpeg\", \"remont3.jpeg\", \"remont4.jpeg\"]', 'Mieszkanie w stanie deweloperskim', '4-pokojowe mieszkanie o powierzchni 100m² na 2. piętrze w nowo wybudowanym budynku', 'Na sprzedaż 4-pokojowe mieszkanie o powierzchni 100 m², znajdujące się na 2. piętrze nowo wybudowanego budynku.\r\n\r\nMieszkanie w stanie deweloperskim, gotowe do aranżacji według własnych potrzeb.\r\nSalon: przestronny, z dużymi oknami, które zapewniają doskonałe doświetlenie\r\nSypialnie: trzy ustawne pomieszczenia, idealne do urządzenia według własnych potrzeb\r\nKuchnia: przestronna, gotowa do wyposażenia w nowoczesny sprzęt AGD\r\nŁazienki: dwie przestronne łazienki', 'Jagiellońska', '20/57', 1892032.00, 18800.00, 4, NULL, NULL),
(3, '[\"Apartament1.jpeg\", \"Apartament2.jpeg\", \"Apartament3.jpeg\", \"Apartament4.jpeg\"]', 'Luksusowy apartament w wieżowcu', '5-pokojowy najwyżej położony apartament w Warszawie o powierzchni 180m² na 10. piętrze w wieżowcu mieszkalnym.', 'Ten wyjątkowy apartament oferuje niezrównany widok na panoramę miasta oraz komfortowe warunki do życia w najwyższym standardzie. Mieszkanie w pełni wykończone.\r\n\r\nSalon: przestronny i elegancki, z dużymi oknami, zapewniającymi panoramiczny widok na miasto\r\nSypialnie: trzy luksusowe pokoje, z możliwością aranżacji\r\nKuchnia: nowoczesna, w pełni wyposażona w sprzęt AGD, z przestrzenią do wygodnego gotowania, jadalnia\r\nŁazienki: dwie ekskluzywne łazienki z wysokiej jakości armaturą', 'Złota', '44/87', 19000000.00, 92471.00, 5, NULL, NULL),
(4, '[\"Dom1.jpeg\",\"Dom2.jpeg\",\"Dom3.jpeg\",\"Dom4.jpeg\"]', 'Dom na obrzeżach miasta', '5-pokojowy dom jednorodzinny o powierzchni 322m², na obrzeżach Warszawy', 'Na sprzedaż wyjątkowy dom, wybudowany w 2007 roku, z najwyższej jakości materiałów. Przestronny, funkcjonalny, z kominkiem, i pięknie utrzymanym ogrodem z oczkiem wodnym. Bezpieczny, z alarmami wewnętrznymi i zewnętrznymi oraz ochroną. Garaż na dwa samochody. Dom położony w malowniczej, cichej okolicy, z doskonałą komunikacją z centrum Warszawy. Blisko przystanek autobusowy i stacja SKM. Niezwykła oferta w urokliwym miejscu!', 'Eugeniusza Bocheńskiego Dubańca', '25', 1950000.00, 5124.00, 5, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `zamowienia`
--

CREATE TABLE `zamowienia` (
  `id` int(11) NOT NULL,
  `nazwa_pokoju` varchar(255) NOT NULL,
  `data` date NOT NULL,
  `uzytkownik` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `pokoje`
--
ALTER TABLE `pokoje`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `zamowienia`
--
ALTER TABLE `zamowienia`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pokoje`
--
ALTER TABLE `pokoje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `zamowienia`
--
ALTER TABLE `zamowienia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
