import { 
  Body, Controller, Post, Put, Get, Param, Delete, 
  HttpCode, HttpStatus, NotFoundException, UseGuards, 
  BadRequestException, Logger, UsePipes, ValidationPipe, Req, 
  HttpException
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from '@vinylplatz/backend/dto';
import { IAlbum } from '@vinylplatz/shared/api';
import { JwtAuthGuard } from '../user/jwt-auth.guard';
import { AlbumRecommendationService } from '../album-recommendation/album-recommendation.service';



@Controller('albums')
export class AlbumController {
  private readonly logger = new Logger(AlbumController.name);

  constructor(private readonly albumService: AlbumService,     
    private readonly albumRecommendationService: AlbumRecommendationService,
  ) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto, @Req() req: any): Promise<IAlbum> {
    // Check if the user object exists on the request and log the appropriate user ID
    if (req.user && '_id' in req.user) {
      this.logger.log(`Creating a new album by user ${req.user._id}`);
      // Pass the user info from the request to the service
      return this.albumService.createAlbum(createAlbumDto, req.user);
    } else {
      // Handle the case when req.user is not populated or does not have _id
      throw new BadRequestException('User information is missing from the request');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('available')
  async getAvailableAlbums(): Promise<IAlbum[]> {
    try {
      return await this.albumService.findAvailableAlbums();
    } catch (error) {
      this.logger.error(`Error fetching available albums: ${error}`);
      throw new HttpException('Failed to fetch available albums', HttpStatus.INTERNAL_SERVER_ERROR);
      console.error('Error fetching available albums:', error);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAlbums(): Promise<IAlbum[]> {
    return this.albumService.findAllAlbums();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAlbumById(@Param('id') id: string): Promise<IAlbum> {
    const album = await this.albumService.findAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateAlbum(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto, @Req() req: any): Promise<IAlbum> {
    if (req.user && '_id' in req.user) {
      const updatedAlbum = await this.albumService.updateAlbum(req.user._id, id, updateAlbumDto);
      if (!updatedAlbum) {
        throw new NotFoundException('Album not found or could not be updated');
      }
      return updatedAlbum;
    } else {
      throw new NotFoundException('User information is missing from the request');
    }
  }
  

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string): Promise<void> {
    try {
      await this.albumService.deleteAlbum(id);
      this.logger.log(`Deleted album with id: ${id}`);
    } catch (error) {
      throw new NotFoundException('Album not found or could not be deleted');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getAlbumsByUser(@Param('userId') userId: string): Promise<IAlbum[]> {
    return this.albumService.findAlbumsByUser(userId);
  }
  

  @UseGuards(JwtAuthGuard)
  @Get('/recommendations/:userId')
  async getRecommendedAlbumsForUser(@Param('userId') userId: string) {
    return this.albumRecommendationService.getRecommendedAlbumsForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('purchased/:userId')
  async getPurchasedAlbumsByUser(@Param('userId') userId: string): Promise<IAlbum[]> {
    return this.albumService.findPurchasedAlbumsByUser(userId);
  }


}

